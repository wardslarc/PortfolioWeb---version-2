import pino from "pino";
import { env } from "../config/env";

export const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "req.headers.x-admin-token",
      "req.headers.x-forwarded-for",
      "req.body.email",
      "req.body.message",
      "res.headers['set-cookie']",
    ],
    remove: true,
  },
});
