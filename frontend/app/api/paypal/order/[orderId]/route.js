const PAYPAL_MODE = "live"; // switch to "sandbox" for sandbox
const PAYPAL_CONFIG = {
  sandbox: {
    clientId: "ARt8pgcFUdW0_your_sandbox_client_id_here",
    secret: "EJtYy7JdYXXXXXXXXXXXXXXX_your_sandbox_secret",
    apiBase: "https://api.sandbox.paypal.com",
  },
  live: {
    clientId: "AY5VcStNQIc_VCvnbGU799W2rU0ewHcnKWl3Tg_h2GrwNTD3SHQ9QEfBISuLlsLOTfAHSTGHY-6BnIqE",
    secret: "EKCExhesShq4WGsH9GDqkyw0YFNKAUtfhAxbEYq_I9I0L4QGImZcmo7S9dcdS80g00d23XuszSeXDmxY",
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