import { NextResponse } from "next/server";

const PAYPAL_MODE = "live"; // switch to "sandbox" for sandbox
const PAYPAL_CONFIG = {
  sandbox: {
    clientId: "ARt8pgcFUdW0_your_sandbox_client_id_here",
    secret: "EJtYy7JdYXXXXXXXXXXXXXXX_your_sandbox_secret",
    apiBase: "https://api.sandbox.paypal.com",
  },
  live: {
    clientId: "AY5VcStNQIc_VCvnbGU799W2rU0ewHcnKWl3Tg_h2GrwNTD3SHQ9QEfBISuLlsLOTfAHSTGHY-6BnIqE",
    secret: "ELiveSecretStringFromPayPalXXXXXXXXXXXXXXX",
    apiBase: "https://api.paypal.com",
  },
};
const ACTIVE = PAYPAL_CONFIG[PAYPAL_MODE];

async function getAccessToken() {
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