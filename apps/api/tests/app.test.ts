import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app";
import { env } from "../src/config/env";
import type { ContactRepository, ContactSubmission } from "../src/modules/contact/types";

const ORIGINAL_ENV = { ...env };

const createRepositoryDouble = () => {
  const submissions: ContactSubmission[] = [];
  const duplicateFingerprints = new Set<string>();

  const repository: ContactRepository = {
    async create(submission) {
      submissions.push(submission);
      duplicateFingerprints.add(submission.fingerprint);
      return `mock-${submissions.length}`;
    },
    async hasRecentDuplicate({ fingerprint }) {
      return duplicateFingerprints.has(fingerprint);
    },
  };

  return { repository, submissions, duplicateFingerprints };
};

const validPayload = (timestamp = Date.now() - 3000) => ({
  name: "Test User",
  email: "test@example.com",
  subject: "Testing contact route",
  message: "This message should be accepted and stored safely.",
  honeypot: "",
  timestamp,
});

afterEach(() => {
  Object.assign(env, ORIGINAL_ENV);
});

test("GET /api/health returns ok", async () => {
  const { repository } = createRepositoryDouble();
  const app = createApp(repository);

  const response = await request(app).get("/api/health");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { ok: true });
});

test("POST /api/contact stores a valid submission", async () => {
  const { repository, submissions } = createRepositoryDouble();
  const app = createApp(repository);

  const response = await request(app)
    .post("/api/contact")
    .set("Content-Type", "application/json")
    .send(validPayload());

  assert.equal(response.status, 201);
  assert.equal(response.body.success, true);
  assert.equal(submissions.length, 1);
  assert.equal(submissions[0]?.source, "portfolio-web");
  assert.equal(submissions[0]?.email, "test@example.com");
  assert.match(submissions[0]?.fingerprint || "", /^[a-f0-9]{64}$/);
});

test("POST /api/contact rejects invalid payloads", async () => {
  const { repository } = createRepositoryDouble();
  const app = createApp(repository);

  const response = await request(app)
    .post("/api/contact")
    .set("Content-Type", "application/json")
    .send({
      name: "A",
      email: "not-an-email",
      subject: "bad",
      message: "short",
      honeypot: "",
      timestamp: Date.now() - 3000,
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.error, "Invalid request body");
});

test("POST /api/contact requires application/json", async () => {
  const { repository } = createRepositoryDouble();
  const app = createApp(repository);

  const response = await request(app)
    .post("/api/contact")
    .type("form")
    .send({
      name: "Test User",
      email: "test@example.com",
      subject: "Testing contact route",
      message: "This message should be rejected before parsing.",
      timestamp: Date.now() - 3000,
    });

  assert.equal(response.status, 415);
  assert.equal(response.body.error, "Content-Type must be application/json");
});

test("POST /api/contact rejects submissions that arrive too quickly", async () => {
  env.CONTACT_MIN_SUBMISSION_AGE_MS = 2500;
  const { repository } = createRepositoryDouble();
  const app = createApp(repository);

  const response = await request(app)
    .post("/api/contact")
    .set("Content-Type", "application/json")
    .send(validPayload(Date.now() - 200));

  assert.equal(response.status, 400);
  assert.equal(response.body.error, "Unable to verify submission timing.");
});

test("POST /api/contact rejects recent duplicate submissions", async () => {
  const { repository, duplicateFingerprints } = createRepositoryDouble();
  const app = createApp(repository);
  const payload = validPayload();
  const firstResponse = await request(app)
    .post("/api/contact")
    .set("Content-Type", "application/json")
    .send(payload);

  assert.equal(firstResponse.status, 201);
  assert.equal(duplicateFingerprints.size, 1);

  const duplicateResponse = await request(app)
    .post("/api/contact")
    .set("Content-Type", "application/json")
    .send(payload);

  assert.equal(duplicateResponse.status, 429);
  assert.match(duplicateResponse.body.error, /similar message/i);
});

test("POST /api/contact rejects untrusted origins in production", async () => {
  env.NODE_ENV = "production";
  env.CONTACT_ALLOWED_PRODUCTION_ORIGINS =
    "https://carlsdaleescalo.com,https://www.carlsdaleescalo.com";
  const { repository } = createRepositoryDouble();
  const app = createApp(repository);

  const response = await request(app)
    .post("/api/contact")
    .set("Origin", "https://evil.example")
    .set("Content-Type", "application/json")
    .send(validPayload());

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error,
    "This form can only be submitted from carlsdaleescalo.com.",
  );
});
