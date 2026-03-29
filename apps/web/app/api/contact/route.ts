import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_DEV_CONTACT_API_URL = "http://localhost:3001/api/contact";
const DEFAULT_DEV_TOKEN_SECRET = "contact-form-dev-token-secret";
const PROXY_SECRET_HEADER = "x-contact-proxy-secret";
const REQUEST_TIMEOUT_MS = 10000;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const resolveContactApiUrl = () => {
  const configuredUrl =
    process.env.CONTACT_API_URL?.trim() ||
    (process.env.NODE_ENV !== "production"
      ? process.env.NEXT_PUBLIC_CONTACT_API_URL?.trim() || ""
      : "");

  if (configuredUrl) {
    return configuredUrl;
  }

  if (process.env.NODE_ENV === "development") {
    return DEFAULT_DEV_CONTACT_API_URL;
  }

  return "";
};

const getTokenSecret = () => {
  const configuredSecret = process.env.CONTACT_FORM_TOKEN_SECRET?.trim();

  if (configuredSecret) {
    return configuredSecret;
  }

  if (process.env.NODE_ENV !== "production") {
    return DEFAULT_DEV_TOKEN_SECRET;
  }

  return "";
};

const getProxySharedSecret = () => {
  const configuredSecret = process.env.CONTACT_PROXY_SHARED_SECRET?.trim();

  if (configuredSecret) {
    return configuredSecret;
  }

  return process.env.NODE_ENV === "production" ? "" : undefined;
};

const getContactTokenTtlMs = () => Number(process.env.CONTACT_TOKEN_TTL_MS || "3600000");

const base64UrlEncode = (value: string) =>
  Buffer.from(value, "utf8").toString("base64url");

const signPayload = (payload: string) =>
  crypto.createHmac("sha256", getTokenSecret()).update(payload).digest("base64url");

const issueContactToken = (origin: string) => {
  const issuedAt = Date.now();
  const payload = {
    exp: issuedAt + getContactTokenTtlMs(),
    iat: issuedAt,
    nonce: crypto.randomBytes(16).toString("hex"),
    origin,
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);

  return {
    issuedAt,
    token: `${encodedPayload}.${signature}`,
  };
};

const getRequestOrigin = (request: NextRequest) => request.headers.get("origin")?.trim() || "";

const isSameOriginRequest = (request: NextRequest) => {
  const requestOrigin = getRequestOrigin(request);

  if (!requestOrigin) {
    return process.env.NODE_ENV !== "production";
  }

  return requestOrigin === request.nextUrl.origin;
};

export async function GET(request: NextRequest) {
  if (!getTokenSecret()) {
    return NextResponse.json(
      { error: "Contact form signing is not configured." },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const { issuedAt, token } = issueContactToken(request.nextUrl.origin);

  return NextResponse.json(
    { issuedAt, token },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { error: "Contact form requests must come from the same origin." },
      {
        status: 403,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const contactApiUrl = resolveContactApiUrl();

  if (!contactApiUrl) {
    return NextResponse.json(
      { error: "Contact form backend is not configured." },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const proxySharedSecret = getProxySharedSecret();

  if (proxySharedSecret === "") {
    return NextResponse.json(
      { error: "Contact form proxy authentication is not configured." },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      {
        status: 415,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const headers = new Headers({
    "Content-Type": "application/json",
  });

  const forwardedOrigin = request.headers.get("origin");
  const forwardedFor = request.headers.get("x-forwarded-for");
  const userAgent = request.headers.get("user-agent");

  if (forwardedOrigin) {
    headers.set("Origin", forwardedOrigin);
  }

  if (forwardedFor) {
    headers.set("X-Forwarded-For", forwardedFor);
  }

  if (userAgent) {
    headers.set("User-Agent", userAgent);
  }

  if (proxySharedSecret) {
    headers.set(PROXY_SECRET_HEADER, proxySharedSecret);
  }

  try {
    const response = await fetch(contactApiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const responseText = await response.text();
    const contentType = response.headers.get("content-type") || "application/json";

    return new NextResponse(responseText, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error && error.name === "TimeoutError"
        ? "The contact service timed out."
        : "Unable to reach the contact service right now.";

    return NextResponse.json(
      { error: message },
      {
        status: 502,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
