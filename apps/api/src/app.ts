import { createHash } from "crypto";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { env } from "./config/env";
import { verifyContactToken } from "./lib/contactSecurity";
import { logger } from "./lib/logger";
import { checkDatabaseReadiness } from "./lib/mongodb";
import { REQUEST_ID_HEADER, requestIdMiddleware } from "./lib/requestId";
import { createMongoContactRepository } from "./modules/contact/repository";
import { contactSchema } from "./modules/contact/schemas";
import type { ContactRepository, ContactSubmission } from "./modules/contact/types";

const parseOrigins = (value: string | undefined) =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

const truncate = (value: string, maxLength: number) => value.slice(0, maxLength);
const PROXY_SECRET_HEADER = "x-contact-proxy-secret";

const getRequestOrigin = (req: express.Request) => {
  const origin = req.header("origin");
  return origin ? origin.trim() : "";
};

const getAllowedOrigins = () =>
  env.NODE_ENV === "production"
    ? parseOrigins(env.CONTACT_ALLOWED_PRODUCTION_ORIGINS)
    : Array.from(new Set([...parseOrigins(env.ALLOWED_ORIGINS), ...parseOrigins(env.WEB_ORIGIN)]));

const isAllowedOrigin = (origin: string) => getAllowedOrigins().includes(origin);

const extractClientIp = (req: express.Request) =>
  (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ||
  req.ip ||
  "unknown";

const buildFingerprint = (submission: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) =>
  createHash("sha256")
    .update(
      [
        submission.name.toLowerCase(),
        submission.email.toLowerCase(),
        submission.subject.toLowerCase(),
        submission.message.toLowerCase(),
      ].join("|"),
    )
    .digest("hex");

const getSubmissionAge = (timestamp: number) => Date.now() - timestamp;

const countLinks = (value: string) => (value.match(/(?:https?:\/\/|www\.)/gi) || []).length;

const hasLongRepeatedCharacterSequence = (value: string) => /(.)\1{9,}/i.test(value);

const hasExcessiveRepeatedWords = (value: string) => {
  const words = value
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter((word) => word.length >= 3);

  if (words.length < 6) {
    return false;
  }

  const counts = new Map<string, number>();

  for (const word of words) {
    counts.set(word, (counts.get(word) || 0) + 1);
  }

  return Array.from(counts.values()).some((count) => count >= 6 || count / words.length > 0.45);
};

const looksLikeSpam = (submission: {
  name: string;
  subject: string;
  message: string;
}) => {
  if (countLinks(submission.message) > 3) {
    return true;
  }

  if (
    hasLongRepeatedCharacterSequence(submission.name) ||
    hasLongRepeatedCharacterSequence(submission.subject) ||
    hasLongRepeatedCharacterSequence(submission.message)
  ) {
    return true;
  }

  if (
    countLinks(submission.name) > 0 ||
    countLinks(submission.subject) > 1 ||
    hasExcessiveRepeatedWords(submission.subject) ||
    hasExcessiveRepeatedWords(submission.message)
  ) {
    return true;
  }

  return false;
};

export const createApp = (
  repository: ContactRepository = createMongoContactRepository(),
) => {
  const app = express();

  app.set("trust proxy", env.TRUST_PROXY_HOPS);
  app.disable("x-powered-by");

  app.use(requestIdMiddleware);
  app.use(
    pinoHttp({
      logger,
      customProps: (req, res) => ({
        requestId: res.getHeader(REQUEST_ID_HEADER) || req.headers[REQUEST_ID_HEADER],
      }),
    }),
  );

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "same-site" },
      referrerPolicy: { policy: "no-referrer" },
    }),
  );

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin && env.NODE_ENV !== "production") {
          callback(null, true);
          return;
        }

        if (origin && isAllowedOrigin(origin)) {
          callback(null, true);
          return;
        }

        callback(null, false);
      },
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", REQUEST_ID_HEADER],
    }),
  );

  app.use(express.json({ limit: "10kb", strict: true }));

  // Keep the endpoint public, but slow down repeated automated abuse at the edge
  // of the API before payloads are parsed or written.
  const contactWriteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: env.NODE_ENV === "production" ? 5 : 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: "Too many submissions. Please try again later.",
    },
  });

  const requireTrustedOrigin: express.RequestHandler = (req, res, next) => {
    if (env.NODE_ENV !== "production") {
      next();
      return;
    }

    const origin = getRequestOrigin(req);

    if (!origin || !isAllowedOrigin(origin)) {
      req.log.warn({ origin }, "Rejected contact request from untrusted origin");
      res.status(403).json({ error: "This form can only be submitted from carlsdaleescalo.com." });
      return;
    }

    next();
  };

  const requireProxySecret: express.RequestHandler = (req, res, next) => {
    if (!env.CONTACT_PROXY_SHARED_SECRET) {
      next();
      return;
    }

    const providedSecret = req.header(PROXY_SECRET_HEADER);

    if (providedSecret !== env.CONTACT_PROXY_SHARED_SECRET) {
      req.log.warn("Rejected contact request without valid proxy secret");
      res.status(403).json({ error: "Invalid contact submission source." });
      return;
    }

    next();
  };

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.get("/api/ready", async (_req, res) => {
    try {
      await checkDatabaseReadiness();
      res.status(200).json({ ok: true });
    } catch {
      res.status(503).json({ ok: false });
    }
  });

  app.post(
    "/api/contact",
    contactWriteLimiter,
    requireProxySecret,
    requireTrustedOrigin,
    async (req, res) => {
    if (!req.is("application/json")) {
      res.status(415).json({ error: "Content-Type must be application/json" });
      return;
    }

    const parsed = contactSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid request body",
        details: parsed.error.flatten(),
      });
      return;
    }

    if (parsed.data.honeypot) {
      req.log.warn("Rejected honeypot submission");
      res.status(400).json({ error: "Invalid submission" });
      return;
    }

    const submissionAge = getSubmissionAge(parsed.data.timestamp);

    if (
      submissionAge < env.CONTACT_MIN_SUBMISSION_AGE_MS ||
      submissionAge > env.CONTACT_MAX_SUBMISSION_AGE_MS
    ) {
      req.log.warn({ submissionAge }, "Rejected contact submission due to invalid timing");
      res.status(400).json({ error: "Unable to verify submission timing." });
      return;
    }

    const normalizedPayload = {
      name: normalizeText(parsed.data.name),
      email: parsed.data.email.trim().toLowerCase(),
      subject: normalizeText(parsed.data.subject),
      message: normalizeText(parsed.data.message),
    };

    const tokenCheck = verifyContactToken(parsed.data.contactToken);

    if (!tokenCheck.ok) {
      req.log.warn({ reason: tokenCheck.reason }, "Rejected contact submission with invalid token");
      res.status(400).json({ error: "Unable to verify contact form session." });
      return;
    }

    const requestOrigin = getRequestOrigin(req);

    if (requestOrigin && tokenCheck.payload.origin !== requestOrigin) {
      req.log.warn(
        { requestOrigin, tokenOrigin: tokenCheck.payload.origin },
        "Rejected contact submission due to origin mismatch",
      );
      res.status(400).json({ error: "Unable to verify contact form origin." });
      return;
    }

    if (Math.abs(parsed.data.timestamp - tokenCheck.payload.iat) > 5000) {
      req.log.warn("Rejected contact submission with mismatched token timestamp");
      res.status(400).json({ error: "Unable to verify contact form timing." });
      return;
    }

    if (looksLikeSpam(normalizedPayload)) {
      req.log.warn("Rejected contact submission due to spam heuristics");
      res.status(400).json({
        error: "Message looks automated or repetitive. Please revise it and try again.",
      });
      return;
    }

    const fingerprint = buildFingerprint(normalizedPayload);
    const duplicateCutoff = new Date(Date.now() - env.CONTACT_DUPLICATE_WINDOW_MS);

    try {
      const hasRecentDuplicate = await repository.hasRecentDuplicate({
        fingerprint,
        since: duplicateCutoff,
      });

      if (hasRecentDuplicate) {
        req.log.warn({ fingerprint }, "Rejected duplicate contact submission");
        res.status(429).json({
          error: "A similar message was already received recently. Please wait before sending it again.",
        });
        return;
      }

      const payload: ContactSubmission = {
        ...normalizedPayload,
        submittedAt: new Date(),
        source: "portfolio-web",
        fingerprint,
        metadata: {
          requestId: res.locals.requestId,
          ip: truncate(extractClientIp(req), 64),
          userAgent: truncate(req.headers["user-agent"] || "unknown", 512),
        },
      };

      const id = await repository.create(payload);

      req.log.info({ submissionId: id }, "Contact submission stored");

      res.status(201).json({
        success: true,
        id,
        message: "Message stored successfully.",
      });
    } catch (error) {
      req.log.error({ err: error }, "Contact storage error");
      res.status(500).json({
        error: "Unable to save message at the moment.",
      });
    }
    },
  );

  app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      req.log.error({ err }, "Unhandled API error");
      res.status(500).json({ error: "Internal server error" });
    },
  );

  return app;
};

export default createApp();
