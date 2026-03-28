export type ContactSubmission = {
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: Date;
  source: "portfolio-web";
  fingerprint: string;
  metadata: {
    requestId?: string;
    ip: string;
    userAgent: string;
  };
};

export type StoredContactSubmission = ContactSubmission & {
  id: string;
};

export type ContactRepository = {
  create: (submission: ContactSubmission) => Promise<string>;
  hasRecentDuplicate: (params: {
    fingerprint: string;
    since: Date;
  }) => Promise<boolean>;
};
