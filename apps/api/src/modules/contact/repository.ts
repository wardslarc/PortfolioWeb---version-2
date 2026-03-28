import { env } from "../../config/env";
import { getDatabase } from "../../lib/mongodb";
import type { ContactRepository, ContactSubmission } from "./types";

const getCollection = async () => {
  const db = await getDatabase();

  return db.collection<ContactSubmission>(env.CONTACT_COLLECTION);
};

export const createMongoContactRepository = (): ContactRepository => ({
  async create(submission: ContactSubmission) {
    const collection = await getCollection();
    const result = await collection.insertOne(submission);

    return result.insertedId.toString();
  },
  async hasRecentDuplicate({ fingerprint, since }) {
    const collection = await getCollection();
    const duplicate = await collection.findOne(
      {
        fingerprint,
        submittedAt: { $gte: since },
      },
      {
        projection: { _id: 1 },
      },
    );

    return Boolean(duplicate);
  },
});
