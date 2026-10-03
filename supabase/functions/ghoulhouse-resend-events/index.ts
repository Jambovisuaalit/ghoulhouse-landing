import { Webhook } from "npm:svix@2.6.1";

const ALLOWED_EVENTS = new Set([
  "email.sent",
  "email.delivered",
  "email.delivery_delayed",
  "email.bounced",
  "email.failed",
  "email.suppressed",
]);

function json(body: Record<string, unknown>, status = 200) {
  return Response.json(body, {
    status,
    headers: { "cache-control": "no-store, max-age=0" },
  });
}

function getSecretKey() {
  const modern = Deno.env.get("SUPABASE_SECRET_KEYS");

  if (modern) {
    try {
      const keys = JSON.parse(modern) as Record<string, string>;
      if (typeof keys.default === "string" && keys.default) return keys.default;
    } catch {
      // Fall through to the legacy key during the transition period.
    }
  }

  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
}

async function rpc(name: string, body: Record<string, unknown> = {}) {
  const url = (Deno.env.get("SUPABASE_URL") || "").replace(/\/$/, "");
  const secretKey = getSecretKey();

  if (!url || !secretKey) {
    throw new Error("Supabase backend credentials unavailable");
  }

  return fetch(`${url}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: secretKey,
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(5_000),
  });
}

async function getWebhookSecret() {
  const response = await rpc("get_ghoulhouse_resend_webhook_secret");

  if (!response.ok) {
    throw new Error(`Webhook secret lookup failed: ${response.status}`);
  }

  const secret = await response.json();

  if (typeof secret !== "string" || !secret.startsWith("whsec_")) {
    throw new Error("Webhook secret is not configured");
  }

  return secret;
}

function tagValue(tags: unknown, name: string) {
  if (!tags) return null;

  if (Array.isArray(tags)) {
    const match = tags.find(
      (tag) =>
        tag &&
        typeof tag === "object" &&
        "name" in tag &&
        tag.name === name &&
        "value" in tag
    ) as { value?: unknown } | undefined;

    return typeof match?.value === "string" ? match.value : null;
  }

  if (typeof tags === "object" && tags !== null) {
    const value = (tags as Record<string, unknown>)[name];
    return typeof value === "string" ? value : null;
  }

  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return json({ ok: false, code: "method_not_allowed" }, 405);
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return json({ ok: false, code: "missing_signature" }, 400);
  }

  const payload = await req.text();
  let event: Record<string, unknown>;

  try {
    const secret = await getWebhookSecret();
    const webhook = new Webhook(secret);

    webhook.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });

    const parsed = JSON.parse(payload);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Invalid webhook payload");
    }
    event = parsed as Record<string, unknown>;
  } catch (error) {
    console.error("GhoulHouse Resend webhook verification failed.", error);
    return json({ ok: false, code: "invalid_signature" }, 400);
  }

  const eventType = typeof event.type === "string" ? event.type : "";

  if (!ALLOWED_EVENTS.has(eventType)) {
    return json({ ok: true, result: "ignored_type" });
  }

  const data =
    event.data && typeof event.data === "object" && !Array.isArray(event.data)
      ? (event.data as Record<string, unknown>)
      : {};

  if (tagValue(data.tags, "source") !== "ghoulhouse_lead") {
    return json({ ok: true, result: "ignored_source" });
  }

  const leadId = tagValue(data.tags, "lead_id");

  if (!leadId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(leadId)) {
    return json({ ok: true, result: "unmatched" });
  }

  const emailId = typeof data.email_id === "string" ? data.email_id : null;
  const messageId = typeof data.message_id === "string" ? data.message_id : null;
  const createdAt =
    typeof event.created_at === "string"
      ? event.created_at
      : typeof data.created_at === "string"
        ? data.created_at
        : new Date().toISOString();

  const bounce =
    data.bounce && typeof data.bounce === "object" && !Array.isArray(data.bounce)
      ? (data.bounce as Record<string, unknown>)
      : null;
  const error =
    data.error && typeof data.error === "object" && !Array.isArray(data.error)
      ? (data.error as Record<string, unknown>)
      : null;

  const detail =
    (bounce && typeof bounce.message === "string" ? bounce.message : null) ||
    (error && typeof error.message === "string" ? error.message : null) ||
    null;

  const response = await rpc("apply_ghoulhouse_resend_event", {
    p_svix_id: svixId,
    p_event_type: eventType,
    p_email_id: emailId,
    p_message_id: messageId,
    p_lead_id: leadId,
    p_event_created_at: createdAt,
    p_detail: detail,
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("GhoulHouse Resend event reconciliation failed.", response.status, body.slice(0, 500));
    return json({ ok: false, code: "reconciliation_failed" }, 500);
  }

  const result = await response.json();
  return json({ ok: true, result });
});
