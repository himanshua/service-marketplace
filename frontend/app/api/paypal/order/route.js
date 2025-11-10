import { NextResponse } from "next/server";

const PAYPAL_MODE = process.env.PAYPAL_MODE === "live" ? "live" : "sandbox";

const ACTIVE =
  PAYPAL_MODE === "live"
    ? {
        clientId: process.env.PAYPAL_LIVE_CLIENT_ID,
        secret: process.env.PAYPAL_LIVE_SECRET,
        apiBase: "https://api.paypal.com",
      }
    : {
        clientId: process.env.PAYPAL_SANDBOX_CLIENT_ID,
        secret: process.env.PAYPAL_SANDBOX_SECRET,
        apiBase: "https://api.sandbox.paypal.com",
      };

async function getAccessToken() {
  if (!ACTIVE.clientId || !ACTIVE.secret) {
    throw new Error("PayPal credentials are not configured.");
  }
  const credentials = Buffer.from(`${ACTIVE.clientId}:${ACTIVE.secret}`).toString("base64");
  const response = await fetch(`${ACTIVE.apiBase}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || "Failed to get PayPal access token.");
  }
  return data.access_token;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const accessToken = await getAccessToken();

    const response = await fetch(`${ACTIVE.apiBase}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: body.intent || "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: body.currency || "USD",
              value: body.amount || "50.00",
            },
            description:
              body.description ||
              (body.serviceTitle ? `Consultation: ${body.serviceTitle}` : "Consultation fee"),
          },
        ],
        application_context: {
          user_action: "PAY_NOW",
          return_url: body.returnUrl || "https://aheadterra.com/chat",
          cancel_url: body.cancelUrl || "https://aheadterra.com/chat",
          brand_name: body.brandName || "AheadTerra",
          shipping_preference: "NO_SHIPPING",
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return Response.json(
        { error: data.message || "Failed to create PayPal order." },
        { status: response.status }
      );
    }
    return Response.json({ id: data.id, status: data.status, links: data.links });
  } catch (error) {
    return Response.json({ error: error.message || "Unexpected PayPal error." }, { status: 500 });
  }
}