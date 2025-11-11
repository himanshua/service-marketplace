import express from "express";
import fetch from "node-fetch";

const router = express.Router();

const PAYPAL_MODE = process.env.PAYPAL_MODE || "live";
const PAYPAL_CLIENT_ID = process.env.PAYPAL_LIVE_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_LIVE_SECRET;
const PAYPAL_API_BASE = PAYPAL_MODE === "live"
  ? "https://api.paypal.com"
  : "https://api.sandbox.paypal.com";

async function getAccessToken() {
  const credentials = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
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

router.post('/order', async (req, res) => {
  try {
    const body = req.body;
    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
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
            description: body.description || "Consultation fee",
          },
        ],
        application_context: {
          user_action: "PAY_NOW",
          return_url: body.returnUrl,
          cancel_url: body.cancelUrl,
          brand_name: "AheadTerra",
          shipping_preference: "NO_SHIPPING",
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("PayPal order creation error:", data);
      return res.status(response.status).json({ error: data.message || "Failed to create PayPal order." });
    }
    res.json({ id: data.id, status: data.status, links: data.links });
  } catch (error) {
    console.error("PayPal API error:", error);
    res.status(500).json({ error: error.message || "Unexpected PayPal error." });
  }
});

router.post('/order/:orderId/capture', async (req, res) => {
  try {
    const { orderId } = req.params;
    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("PayPal order capture error:", data);
      return res.status(response.status).json({ error: data.message || "Failed to capture PayPal order." });
    }
    res.json(data);
  } catch (error) {
    console.error("PayPal capture API error:", error);
    res.status(500).json({ error: error.message || "Unexpected PayPal capture error." });
  }
});

export default router;