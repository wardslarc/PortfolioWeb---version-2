import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { GET, POST } from "../app/api/contact/route";

const ORIGINAL_ENV = { ...process.env };
const ORIGINAL_FETCH = global.fetch;

const resetState = () => {
  global.fetch = ORIGINAL_FETCH;
  process.env = { ...ORIGINAL_ENV };
};

const testGetToken = async () => {
  process.env.CONTACT_FORM_TOKEN_SECRET = "test-contact-token-secret-123";

  const request = new NextRequest("https://example.com/api/contact");
  const response = await GET(request);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(typeof body.token, "string");
  assert.equal(typeof body.issuedAt, "number");
};

const testRejectCrossOriginPost = async () => {
  const request = new NextRequest("https://example.com/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://evil.example",
    },
    body: JSON.stringify({}),
  });

  const response = await POST(request);
  const body = await response.json();

  assert.equal(response.status, 403);
  assert.match(body.error, /same origin/i);
};

const testForwardValidPost = async () => {
  process.env.CONTACT_API_URL = "https://api.example.com/api/contact";
  process.env.CONTACT_PROXY_SHARED_SECRET = "shared-secret-123456";

  global.fetch = async (input, init) => {
    assert.equal(String(input), "https://api.example.com/api/contact");
    assert.equal(init?.method, "POST");

    const headers = init?.headers as Headers;
    assert.equal(headers.get("x-contact-proxy-secret"), "shared-secret-123456");

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: {
        "content-type": "application/json",
      },
    });
  };

  const request = new NextRequest("https://example.com/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://example.com",
      "user-agent": "test-agent",
      "x-forwarded-for": "203.0.113.10",
    },
    body: JSON.stringify({ hello: "world" }),
  });

  const response = await POST(request);
  const body = await response.json();

  assert.equal(response.status, 201);
  assert.deepEqual(body, { success: true });
};

const testRequireTokenSecretInProduction = async () => {
  process.env.NODE_ENV = "production";
  delete process.env.CONTACT_FORM_TOKEN_SECRET;

  const request = new NextRequest("https://example.com/api/contact");
  const response = await GET(request);
  const body = await response.json();

  assert.equal(response.status, 503);
  assert.match(body.error, /signing is not configured/i);
};

const testRequireProxySecretInProduction = async () => {
  process.env.NODE_ENV = "production";
  process.env.CONTACT_FORM_TOKEN_SECRET = "test-contact-token-secret-123";
  process.env.CONTACT_API_URL = "https://api.example.com/api/contact";
  delete process.env.CONTACT_PROXY_SHARED_SECRET;

  const request = new NextRequest("https://example.com/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://example.com",
    },
    body: JSON.stringify({ hello: "world" }),
  });

  const response = await POST(request);
  const body = await response.json();

  assert.equal(response.status, 503);
  assert.match(body.error, /proxy authentication is not configured/i);
};

const run = async () => {
  try {
    await testGetToken();
    resetState();

    await testRejectCrossOriginPost();
    resetState();

    await testForwardValidPost();
    resetState();

    await testRequireTokenSecretInProduction();
    resetState();

    await testRequireProxySecretInProduction();
    resetState();

    console.log("web contact route tests passed");
  } catch (error) {
    resetState();
    throw error;
  }
};

void run();
