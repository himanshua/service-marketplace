const PAYPAL_MODE = process.env.PAYPAL_MODE ?? "sandbox";

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

export async function POST(_req, { params }) {
  try {
    const orderId = params.orderId;
    const accessToken = await getAccessToken();

    const response = await fetch(`${ACTIVE.apiBase}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return Response.json(
        { error: data.message || "Failed to capture PayPal order." },
        { status: response.status }
      );
    }
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message || "Unexpected PayPal error." }, { status: 500 });
  }
}