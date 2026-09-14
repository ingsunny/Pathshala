# Pathshala

Pathshala is a full-stack learning platform built with Next.js, MongoDB, Redux Toolkit, and Tailwind CSS. It includes enrollment, lesson progress, written lesson summaries, a custom video player, timed final assessments, server-side grading, and locally generated PDF certificates.

## Local setup

1. Copy `.env.example` to `.env` and replace the development secrets.
2. Start MongoDB:

   ```bash
   docker compose up -d
   ```

3. Install dependencies and load the canonical course content:

   ```bash
   npm install
   npm run db:seed-content
   npm run db:migrate-certificates
   ```

4. Start the application:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Learning model

- `courses` is the canonical source for syllabi, lesson content, video URLs, and protected assessment answer keys.
- A user stores lightweight enrollments with a course reference, completed lesson IDs, and assessment results. Course content is not duplicated into user records.
- All lessons must be complete before the 45-minute final assessment unlocks.
- Assessments are graded on the server. A score of 70% or higher issues a certificate under `public/uploads/certificates`.
- The content seed is idempotent and preserves stable lesson and question IDs when rerun.

## Quality checks

```bash
npm run lint
npm run build
npm run test:e2e
npm audit
```

The Playwright suite exercises public pages, authentication boundaries, responsive dashboard and learning flows, manual and automatic lesson navigation, protected assessment grading, and local certificate delivery on desktop and mobile viewports.
