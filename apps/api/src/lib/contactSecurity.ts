import crypto from "crypto";

type ContactTokenPayload = {
  exp: number;
  iat: number;
  nonce: string;
  origin: string;
};

const DEFAULT_DEV_TOKEN_SECRET = "contact-form-dev-token-secret";

const base64UrlEncode = (value: string) =>
  Buffer.from(value, "utf8").toString("base64url");

const base64UrlDecode = (value: string) =>
  Buffer.from(value, "base64url").toString("utf8");

const getTokenSecret = () => {
  const configuredSecret = process.env.CONTACT_FORM_TOKEN_SECRET?.trim();

  if (configuredSecret) {
    return configuredSecret;
  }

  if (process.env.NODE_ENV !== "production") {
    return DEFAULT_DEV_TOKEN_SECRET;
  }

  throw new Error("CONTACT_FORM_TOKEN_SECRET is required in production.");
};

const signPayload = (payload: string) =>
  crypto.createHmac("sha256", getTokenSecret()).update(payload).digest("base64url");

export const issueContactToken = ({
  origin,
  ttlMs,
}: {
  origin: string;
  ttlMs: number;
}) => {
  const issuedAt = Date.now();
  const payload: ContactTokenPayload = {
    exp: issuedAt + ttlMs,
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

export const verifyContactToken = (
  token: string,
): { ok: true; payload: ContactTokenPayload } | { ok: false; reason: string } => {
  const [encodedPayload, providedSignature] = token.split(".");

  if (!encodedPayload || !providedSignature) {
    return { ok: false, reason: "Malformed token." };
  }

  const expectedSignature = signPayload(encodedPayload);
  const providedBuffer = Uint8Array.from(Buffer.from(providedSignature, "utf8"));
  const expectedBuffer = Uint8Array.from(Buffer.from(expectedSignature, "utf8"));

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return { ok: false, reason: "Invalid token signature." };
  }

  let payload: ContactTokenPayload;

  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload)) as ContactTokenPayload;
  } catch {
    return { ok: false, reason: "Invalid token payload." };
  }

  if (
    typeof payload.iat !== "number" ||
    typeof payload.exp !== "number" ||
    typeof payload.nonce !== "string" ||
    typeof payload.origin !== "string"
  ) {
    return { ok: false, reason: "Invalid token fields." };
  }

  if (!payload.origin || !payload.nonce || payload.nonce.length < 16) {
    return { ok: false, reason: "Invalid token claims." };
  }

  if (Date.now() > payload.exp) {
    return { ok: false, reason: "Expired token." };
  }

  return { ok: true, payload };
};
