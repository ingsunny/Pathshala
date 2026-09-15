import { expect, test } from "@playwright/test";

test("landing page presents the learning catalog", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /Build skills that change what comes next/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Learning, without the noise/i }),
  ).toBeVisible();
  await expect(page.locator("#courses")).toBeVisible();
});

test("course search filters the live catalog", async ({ page }) => {
  await page.goto("/search_courses");

  await expect(
    page.getByRole("heading", { name: "What do you want to learn?" }),
  ).toBeVisible();
  await expect(page.getByText("3 found")).toBeVisible();

  await page.getByPlaceholder("Search by course or category").fill("Python");
  await expect(
    page.getByRole("heading", { name: /python/i }).last(),
  ).toBeVisible();
  await expect(page.getByText("1 found")).toBeVisible();

  await page
    .getByPlaceholder("Search by course or category")
    .fill("not-a-real-course");
  await expect(
    page.getByRole("heading", { name: "No matching courses" }),
  ).toBeVisible();
});

test("login is accessible and protected pages redirect", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);

  await expect(
    page.getByRole("heading", { name: "Sign in to keep learning" }),
  ).toBeVisible();
  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.getByRole("textbox", { name: /Password/ })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Sign in", exact: true }),
  ).toBeVisible();
});

test("course details can be opened directly", async ({ page, request }) => {
  const response = await request.get("/api/get_course");
  expect(response.ok()).toBeTruthy();
  const { courses } = await response.json();
  expect(courses.length).toBeGreaterThan(0);

  await page.goto(`/categories/${courses[0]._id}`);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: `${courses[0].name} Course`,
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByText(courses[0].description)).toBeVisible();
});
