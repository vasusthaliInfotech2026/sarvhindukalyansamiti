
/**
 * Email adapter for local development and GoDaddy Node.js Hosting.
 * Local: EMAIL_PROVIDER=mock (logs the message; does not send it).
 * GoDaddy: EMAIL_PROVIDER=godaddy (uses the hosting's local email gateway).
 */

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}) {
  const recipients = (Array.isArray(to) ? to : [to])
    .filter(
      (address) =>
        typeof address === "string" && address.trim()
    );

  if (recipients.length === 0) {
    throw new Error("Email recipient is missing.");
  }

  if (!subject || (!html && !text)) {
    throw new Error("Email subject and message content are required.");
  }

  const provider =
    process.env.EMAIL_PROVIDER ||
    (process.env.NODE_ENV === "production" ? "godaddy" : "mock");

  if (provider === "mock") {
    console.info("[EMAIL MOCK] Email was not sent.", {
      from: "info@sarvhindukalyansamiti.org",
      to: recipients,
      subject,
      text: text || "(HTML email; see html field)",
    });

    return {
      messageId: `mock-${Date.now()}`,
      mocked: true,
    };
  }

  if (provider !== "godaddy") {
    throw new Error(`Unsupported EMAIL_PROVIDER: ${provider}`);
  }

  const gatewayUrl =
    "http://127.0.0.1:2525/api/email/send";

  const payload = {
    from: "info@sarvhindukalyansamiti.org",
    to: recipients,
    subject,
    ...(html ? { html } : {}),
    ...(text ? { text } : {}),
    ...(replyTo ? { replyTo } : {}),
  };

  console.log("[EMAIL] Sending email through GoDaddy gateway.", {
    from: payload.from,
    to: recipients,
    subject,
  });

  const response = await fetch(gatewayUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30000),
  });

  const responseText = await response.text();

  let result = {};

  try {
    result = responseText ? JSON.parse(responseText) : {};
  } catch {
    result = { error: responseText };
  }

  if (
    !response.ok ||
    result.success !== true ||
    !result.messageId
  ) {
    console.error("[EMAIL] GoDaddy gateway failed.", {
      status: response.status,
      response: result,
    });

    throw new Error(
      `GoDaddy email gateway failed (HTTP ${response.status}).`
    );
  }

  console.log("[EMAIL] SUCCESS: Gateway accepted email.", {
    from: payload.from,
    to: recipients,
    messageId: result.messageId,
  });

  return {
    messageId: result.messageId,
    mocked: false,
  };
}
