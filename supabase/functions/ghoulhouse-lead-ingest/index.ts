import { createRemoteJWKSet, jwtVerify } from "npm:jose@6.2.12";

const TEAM_SLUG = "info-32533854s-projects";
const TEAM_ID = "team_zwsvoePoiBeskRuyl2Iar883";
const PROJECT_ID = "prj_4St4iNqJbNIbdpsoOaftanarvDLW";
const PROJECT_NAME = "ghoulhouse-home";
const AUDIENCE = `https://vercel.com/${TEAM_SLUG}`;
const ALLOWED_ISSUERS = [
  `https://oidc.vercel.com/${TEAM_SLUG}`,
  "https://oidc.vercel.com",
];
const ALLOWED_ENVIRONMENTS = new Set(["preview", "production"]);
const JWKS = createRemoteJWKSet(new URL("https://oidc.vercel.com/.well-known/jwks"));

function json(body: Record<string, unknown>, status: number, headers: HeadersInit = {}) {
  return Response.json(body, {
    status,
    headers: {
      "cache-control": "no-store, max-age=0",
      ...Object.fromEntries(new Headers(headers)),
    },
  });
}

async function verifyVercelWorkload(req: Request) {
  const authorization = req.headers.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";

  if (!token) return null;

  for (const issuer of ALLOWED_ISSUERS) {
    try {
      const { payload } = await jwtVerify(token, JWKS, {
        issuer,
        audience: AUDIENCE,
        algorithms: ["RS256"],
      });

      const environment = typeof payload.environment === "string" ? payload.environment : "";

      if (
        payload.owner_id !== TEAM_ID ||
        payload.project_id !== PROJECT_ID ||
        payload.project !== PROJECT_NAME ||
        !ALLOWED_ENVIRONMENTS.has(environment)
      ) {
        return null;
      }

      return payload;
    } catch {
      // Try the other supported Vercel issuer mode.
    }
  }

  return null;
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

Deno.serve(async (req: Request) => {
  const workload = await verifyVercelWorkload(req);

  if (!workload) {
    return json({ ok: false, code: "unauthorized_workload" }, 401);
  }

  if (req.method === "GET") {
    return json(
      {
        ok: true,
        environment: workload.environment,
        project: workload.project,
      },
      200
    );
  }

  if (req.method !== "POST") {
    return json({ ok: false, code: "method_not_allowed" }, 405, { allow: "GET, POST" });
  }

  const rateKey = (req.headers.get("x-gh-client-key") || "").trim().toLowerCase();

  if (!/^[0-9a-f]{64}$/.test(rateKey)) {
    return json({ ok: false, code: "invalid_rate_key" }, 400);
  }

  let lead: Record<string, unknown>;

  try {
    const parsed = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return json({ ok: false, code: "invalid_payload" }, 400);
    }
    lead = parsed as Record<string, unknown>;
  } catch {
    return json({ ok: false, code: "invalid_payload" }, 400);
  }

  const supabaseUrl = (Deno.env.get("SUPABASE_URL") || "").replace(/\/$/, "");
  const secretKey = getSecretKey();

  if (!supabaseUrl || !secretKey) {
    console.error("GhoulHouse trusted ingest missing Supabase server credentials.");
    return json({ ok: false, code: "storage_unavailable" }, 503);
  }

  let response: Response;

  try {
    response = await fetch(`${supabaseUrl}/rest/v1/rpc/submit_ghoulhouse_lead_v4`, {
      method: "POST",
      headers: {
        apikey: secretKey,
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        p_rate_key: rateKey,
        p_intent: lead.intent ?? null,
        p_company: lead.company ?? null,
        p_name: lead.name ?? null,
        p_email: lead.email ?? null,
        p_profile: lead.profile ?? null,
        p_phone: lead.phone ?? null,
        p_website: lead.website ?? null,
        p_instagram: lead.instagram ?? null,
        p_message: lead.message ?? null,
        p_service: lead.service ?? null,
        p_no_profile: lead.noProfile ?? false,
      }),
      signal: AbortSignal.timeout(5_000),
    });
  } catch (error) {
    console.error("GhoulHouse trusted ingest storage request failed.", error);
    return json({ ok: false, code: "storage_timeout" }, 504);
  }

  if (!response.ok) {
    const detail = await response.text();

    if (detail.includes("rate_limited")) {
      return json(
        { ok: false, code: "rate_limited" },
        429,
        { "retry-after": "600" }
      );
    }

    if (detail.includes("invalid_") || response.status === 400) {
      return json({ ok: false, code: "invalid_payload" }, 400);
    }

    console.error("GhoulHouse trusted ingest RPC failed.", response.status, detail.slice(0, 500));
    return json({ ok: false, code: "storage_failed" }, 502);
  }

  const id = await response.json();
  return json({ ok: true, id }, 201);
});
