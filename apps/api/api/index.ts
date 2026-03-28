import "../src/config/env";
import app from "../src/app";

// Vercel uses this file as the serverless entrypoint while local development
// uses `src/server.ts` to run the same Express app as a normal Node server.
export default app;
