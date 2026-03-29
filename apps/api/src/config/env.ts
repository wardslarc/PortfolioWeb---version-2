import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { z } from "zod";

const envCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), ".env.local"),
  path.resolve(process.cwd(), "../../.env"),
  path.resolve(process.cwd(), "../../.env.local"),
];

for (const candidate of envCandidates) {
  if (fs.existsSync(candidate)) {
    dotenv.config({ path: candidate, override: false });
  }
}

const baseEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3001),
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).default(1),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  MONGODB_DB_NAME: z.string().default("portfolio"),
  CONTACT_COLLECTION: z.string().default("contact_submissions"),
  ALLOWED_ORIGINS: z.string().optional(),
  WEB_ORIGIN: z.string().optional(),
  CONTACT_FORM_TOKEN_SECRET: z.string().trim().min(16).optional(),
  CONTACT_PROXY_SHARED_SECRET: z.string().trim().min(16).optional(),
  CONTACT_TOKEN_TTL_MS: z.coerce.number().int().min(60000).default(3600000),
  CONTACT_ALLOWED_PRODUCTION_ORIGINS: z
    .string()
    .default("https://carlsdaleescalo.com,https://www.carlsdaleescalo.com"),
  CONTACT_MIN_SUBMISSION_AGE_MS: z.coerce.number().int().min(500).default(2500),
  CONTACT_MAX_SUBMISSION_AGE_MS: z.coerce.number().int().min(60000).default(7200000),
  CONTACT_DUPLICATE_WINDOW_MS: z.coerce.number().int().min(10000).default(900000),
});

const envSchema = baseEnvSchema.superRefine((value, ctx) => {
  if (value.NODE_ENV !== "production") {
    return;
  }

  if (!value.CONTACT_FORM_TOKEN_SECRET) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "CONTACT_FORM_TOKEN_SECRET is required in production.",
      path: ["CONTACT_FORM_TOKEN_SECRET"],
    });
  }

  if (!value.CONTACT_PROXY_SHARED_SECRET) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "CONTACT_PROXY_SHARED_SECRET is required in production.",
      path: ["CONTACT_PROXY_SHARED_SECRET"],
    });
  }
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(
    `Invalid API environment configuration: ${JSON.stringify(parsedEnv.error.flatten().fieldErrors)}`,
  );
}

export const env = parsedEnv.data;
