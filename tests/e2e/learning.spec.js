import { expect, test } from "@playwright/test";
import { MongoClient, ObjectId } from "mongodb";

const testUsers = new Set();

test.afterAll(async () => {
  if (!testUsers.size) return;
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const users = await client
    .db("pathshala")
    .collection("users")
    .find({
      email: { $in: [...testUsers] },
    })
    .toArray();
  await client
    .db("pathshala")
    .collection("certificates")
    .deleteMany({
      user_id: { $in: users.map((user) => user._id.toString()) },
    });
  await client
    .db("pathshala")
    .collection("users")
    .deleteMany({ email: { $in: [...testUsers] } });
  await client.close();
});

async function createEnrolledLearner(page) {
  const email = `e2e-${Date.now()}-${Math.random().toString(36).slice(2)}@example.test`;
  testUsers.add(email);

  const signup = await page.request.post("/api/signup", {
    data: {
      firstName: "E2E",
      lastName: "Learner",
      email,
      password: "TestPass1!",
    },
  });
  expect(signup.status()).toBe(201);

  const catalog = await page.request.get("/api/get_course");
  const { courses } = await catalog.json();
  expect(courses.length).toBeGreaterThan(0);

  const enrollment = await page.request.post("/api/enroll_course", {
    data: { courseId: courses[0]._id },
  });
  expect(enrollment.ok()).toBeTruthy();
  const tutor = await page.request.post("/api/tutor", {
    data: { message: "How should I study this course?" },
  });
  expect(tutor.ok()).toBeTruthy();
  expect((await tutor.json()).reply).toBeTruthy();
  return { course: courses[0], email };
}

test("dashboard and course flow work without stale content", async ({
  page,
}, testInfo) => {
  const { course } = await createEnrolledLearner(page);
  await page.goto("/dashboard");

  await expect(
    page.getByRole("heading", { name: /Welcome back, E2E/i }),
  ).toBeVisible();
  await expect(
    page.getByText(course.name, { exact: true }).first(),
  ).toBeVisible();
  await expect(page.locator("body")).not.toHaveCSS("overflow-x", "scroll");
  await page.screenshot({
    path: testInfo.outputPath("dashboard.png"),
    fullPage: true,
  });

  await page
    .getByRole("link", { name: /start course|resume course/i })
    .first()
    .click();
  await expect(page.getByLabel(/video player/i)).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.locator("video source")).toHaveAttribute(
    "src",
    "https://s3.toosio.com/t/pathshala/videoplayback.mp4",
  );
  await expect(page.getByRole("button", { name: "Play video" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Toggle fullscreen" }),
  ).toBeVisible();

  const firstLesson = await page
    .getByRole("heading", { level: 1 })
    .textContent();
  const nextButton = page.getByRole("button", { name: /Complete & next/i });
  if (await nextButton.isVisible()) {
    await nextButton.click();
    await expect(page.getByRole("heading", { level: 1 })).not.toHaveText(
      firstLesson,
    );
  }

  await page.screenshot({
    path: testInfo.outputPath("learning-workspace.png"),
    fullPage: true,
  });
});

test("completed video offers and performs five-second auto-advance", async ({
  page,
}) => {
  await createEnrolledLearner(page);
  await page.goto("/dashboard");
  await page
    .getByRole("link", { name: /start course|resume course/i })
    .first()
    .click();

  const nextButton = page.getByRole("button", { name: /Complete & next/i });
  await expect(nextButton).toBeVisible();

  const firstLesson = await page
    .getByRole("heading", { level: 1 })
    .textContent();
  await page.locator("video").dispatchEvent("ended");
  await expect(page.getByText("Lesson complete")).toBeVisible();
  await expect(page.getByText(/Next: .* in 5 seconds/)).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).not.toHaveText(
    firstLesson,
    {
      timeout: 7000,
    },
  );
});

test("final assessment is locked, graded on the server, and issues a local certificate", async ({
  page,
}) => {
  const { course, email } = await createEnrolledLearner(page);

  const locked = await page.request.post("/api/assessment", {
    data: { action: "start", courseId: course._id },
  });
  expect(locked.status()).toBe(403);

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const database = client.db("pathshala");
  const canonicalCourse = await database
    .collection("courses")
    .findOne({ _id: new ObjectId(course._id) });
  const topicIds = canonicalCourse.syllabus.flatMap((chapter) =>
    chapter.topics.map((topic) => topic._id),
  );
  await database
    .collection("users")
    .updateOne(
      { email },
      {
        $set: {
          "enrollments.0.completedTopicIds": topicIds,
          "enrollments.0.progressPercent": 100,
        },
      },
    );
  const start = await page.request.post("/api/assessment", {
    data: { action: "start", courseId: course._id },
  });
  expect(start.ok()).toBeTruthy();
  const assessment = await start.json();
  expect(assessment.questions).toHaveLength(20);
  expect(assessment.questions[0]).not.toHaveProperty("correctOption");
  expect(assessment.questions[0]).not.toHaveProperty("explanation");

  const integrity = await page.request.post("/api/assessment", {
    data: {
      action: "integrity_event",
      courseId: course._id,
      eventType: "tab_hidden",
    },
  });
  expect(integrity.ok()).toBeTruthy();
  const loggedUser = await database.collection("users").findOne({ email });
  expect(
    loggedUser.enrollments[0].assessmentResult.integrityEvents,
  ).toHaveLength(1);
  await client.close();

  const answers = canonicalCourse.finalAssessment.questions.map((question) => ({
    questionId: question._id.toString(),
    option: question.correctOption,
  }));
  const submission = await page.request.post("/api/assessment", {
    data: { action: "submit", courseId: course._id, answers },
  });
  expect(submission.ok()).toBeTruthy();
  const result = await submission.json();
  expect(result.passed).toBeTruthy();
  expect(result.score).toBe(100);
  expect(result.certificateUrl).toMatch(/^\/uploads\/certificates\/.+\.pdf$/);

  const certificate = await page.request.get(result.certificateUrl);
  expect(certificate.ok()).toBeTruthy();
  expect(certificate.headers()["content-type"]).toContain("application/pdf");

  const slug = course.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  await page.goto(`/dashboard/screen/${slug}/${course._id}?assessment=1`);
  await expect(page.getByText("Assessment passed")).toBeVisible();
  await expect(page.getByRole("heading", { name: "100%" })).toBeVisible();
});
