# Portfolio Monorepo

Monorepo for Carls Dale Escalo's portfolio and contact backend. The repository is organized for separate Vercel deployments:

- `apps/web`: Next.js portfolio frontend
- `apps/api`: Vercel serverless backend for the contact form

## Stack

- npm workspaces
- Next.js App Router
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Vercel Functions
- Express
- MongoDB

## Repository Layout

```text
apps/
  api/
    api/index.ts       # Vercel entrypoint for the Express app
    src/app.ts         # Express app and routes
    src/lib/mongodb.ts # MongoDB connection helper
    package.json
    tsconfig.json
    vercel.json

  web/
    app/               # Next.js App Router entrypoints
    public/            # Static assets
    src/               # Components, context, helpers
    package.json
    next.config.js
    tailwind.config.js
    tsconfig.json

assets/                # README screenshots
package.json           # Workspace scripts
.env.example           # Shared deployment env reference
```

## Workspace Scripts

Install all dependencies from the repo root:

```bash
npm install
```

Run the frontend:

```bash
npm run dev:web
```

Run the backend locally with Vercel dev:

```bash
npm run dev:api
```

Build both apps:

```bash
npm run build
```

Build only the frontend:

```bash
npm run build:web
```

Build only the API typecheck:

```bash
npm run build:api
```

## Environment Variables

Copy `.env.example` and configure the values for your environment.

### Frontend

- `NEXT_PUBLIC_CONTACT_API_URL`
  The full backend URL used by the contact form.
  Example:
  `https://your-api-project.vercel.app/api/contact`

### Backend

- `ALLOWED_ORIGINS`
  Comma-separated list of allowed frontend origins
- `WEB_ORIGIN`
  Optional single-origin fallback
- `MONGODB_URI`
  MongoDB connection string
- `MONGODB_DB_NAME`
  Database name for the portfolio backend
- `CONTACT_COLLECTION`
  Optional collection name for contact submissions
- `CONTACT_ALLOWED_PRODUCTION_ORIGINS`
  Allowed production browser origins. Defaults to `https://carlsdaleescalo.com,https://www.carlsdaleescalo.com`
- `CONTACT_MIN_SUBMISSION_AGE_MS`
  Minimum age for a browser-started submission before the backend accepts it
- `CONTACT_MAX_SUBMISSION_AGE_MS`
  Maximum accepted age for a submission timestamp
- `CONTACT_DUPLICATE_WINDOW_MS`
  Time window for rejecting repeated identical messages

## Contact Form Flow

1. The frontend form in `apps/web` validates input, keeps a hidden honeypot field, and sends a client-side start timestamp with each submission.
2. The backend Express endpoint validates input again, enforces production origin restrictions, rejects bot-like timing, rate limits by client IP, blocks recent duplicates, and stores accepted submissions in MongoDB.
3. The frontend displays success or retry feedback based on the API response.

## Vercel Deployment

Deploy the apps as two separate Vercel projects from the same monorepo:

### Web Project

- Root directory: `apps/web`
- Framework preset: Next.js
- Environment variable:
  `NEXT_PUBLIC_CONTACT_API_URL=https://your-api-project.vercel.app/api/contact`

### API Project

- Root directory: `apps/api`
- Framework preset: Other
- Vercel will use `vercel.json` and the `api/index.ts` Express entrypoint
- Set these environment variables:
  `ALLOWED_ORIGINS`, `WEB_ORIGIN`, `MONGODB_URI`, `MONGODB_DB_NAME`, `CONTACT_COLLECTION`

## Notes

- The repo is already disconnected from the previous Git remote.
- `apps/web` is the production frontend.
- `apps/api` is ready for Vercel serverless deployment.
- The web build still skips lint during production builds because of legacy story/demo files under `apps/web/src/stories/`.
