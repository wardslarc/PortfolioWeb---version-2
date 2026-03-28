import { Db, MongoClient } from "mongodb";
import { env } from "../config/env";

let clientPromise: Promise<MongoClient> | null = null;
let indexesPromise: Promise<void> | null = null;

// Reuse the client across requests in the same runtime to avoid opening a new
// MongoDB connection for every submission.
export const getDatabase = async (): Promise<Db> => {
  if (!clientPromise) {
    clientPromise = new MongoClient(env.MONGODB_URI).connect();
  }

  const client = await clientPromise;
  const db = client.db(env.MONGODB_DB_NAME);

  if (!indexesPromise) {
    const collection = db.collection(env.CONTACT_COLLECTION);

    indexesPromise = Promise.all([
      collection.createIndex({ submittedAt: -1 }),
      collection.createIndex({ email: 1 }),
      collection.createIndex({ fingerprint: 1, submittedAt: -1 }),
      collection.createIndex({ "metadata.requestId": 1 }, { sparse: true }),
    ]).then(() => undefined).catch((error) => {
      indexesPromise = null;
      throw error;
    });
  }

  await indexesPromise;

  return db;
};

export const checkDatabaseReadiness = async (): Promise<void> => {
  const db = await getDatabase();
  await db.command({ ping: 1 });
};
