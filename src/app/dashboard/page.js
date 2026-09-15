"use client";

import {
  AcademicCapIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BookOpenIcon,
  CheckBadgeIcon,
  ChevronRightIcon,
  ClockIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  SparklesIcon,
  TrophyIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Certificates from "@/components/Certificates";
import BrandLogo from "@/components/BrandLogo";
import ExternalImage from "@/components/ExternalImage";
import { logOut } from "@/redux/user/userSlice";

const navigation = [
  { id: "overview", label: "Overview", icon: HomeIcon },
  { id: "courses", label: "My courses", icon: BookOpenIcon },
  { id: "certificates", label: "Certificates", icon: TrophyIcon },
];

function getCourseProgress(course) {
  const topics =
    course.syllabus?.flatMap((chapter) => chapter.topics || []) || [];
  const completed = topics.filter((topic) => topic.topicProgress).length;
  const percent = topics.length
    ? Math.round((completed / topics.length) * 100)
    : 0;
  return { total: topics.length, completed, percent };
}

function courseHref(course) {
  const slug = course.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `/dashboard/screen/${slug}/${course._id}`;
}

function DashboardSkeleton() {
  return (
    <main
      className="min-h-screen bg-[#f5f8f6] p-6 lg:pl-[19.5rem]"
      aria-busy="true"
    >
      <div className="mx-auto max-w-7xl animate-pulse space-y-8">
        <div className="h-16 rounded-2xl bg-[#dfe6e1]" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-32 rounded-2xl bg-[#dfe6e1]" />
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="h-80 rounded-3xl bg-[#dfe6e1]" />
          <div className="h-80 rounded-3xl bg-[#dfe6e1]" />
        </div>
      </div>
      <span className="sr-only">Loading your dashboard</span>
    </main>
  );
}

function CourseCard({ course, featured = false }) {
  const progress = getCourseProgress(course);
  const assessmentPassed = course.assessmentResult?.status === "passed";
  const lessonsFinished = progress.percent === 100;

  return (
    <article
      className={`group overflow-hidden rounded-3xl border border-[#dfe6e1] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#dfe6e1]/70 ${
        featured ? "lg:grid lg:grid-cols-[1.1fr_1fr]" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden bg-[#15231c] ${featured ? "min-h-64" : "h-44"}`}
      >
        <ExternalImage
          src={course.img1 || "/android.png.webp"}
          alt=""
          className="h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#15231c]/80 via-[#15231c]/10 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#415048] shadow-sm">
          {course.category}
        </span>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
          <span className="flex items-center gap-1.5 text-sm font-medium">
            <ClockIcon className="h-4 w-4" /> {course.duration}
          </span>
          <span className="rounded-full bg-[#26815f] px-2.5 py-1 text-xs font-bold">
            {progress.percent}%
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-between p-5 sm:p-6">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#176b4d]">
            {assessmentPassed
              ? "Course completed"
              : lessonsFinished
                ? "Final test ready"
                : progress.completed === 0
                  ? "Ready to start"
                  : "Continue learning"}
          </p>
          <h3 className="text-xl font-bold tracking-tight text-[#15231c]">
            {course.name}
          </h3>
          {featured && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#637069]">
              {course.description}
            </p>
          )}
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-[#748179]">
            <span>
              {progress.completed} of {progress.total} lessons complete
            </span>
            <span>{progress.percent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#edf2ee]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#26815f] to-[#39906d] transition-all duration-500"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <Link
            href={`${courseHref(course)}${lessonsFinished && !assessmentPassed ? "?assessment=1" : ""}`}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#15231c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#176b4d] focus:outline-none focus:ring-2 focus:ring-[#26815f] focus:ring-offset-2"
          >
            <PlayIcon className="h-4 w-4" />
            {assessmentPassed
              ? "Review course"
              : lessonsFinished
                ? "Take final test"
                : progress.completed === 0
                  ? "Start course"
                  : "Resume course"}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser, sessionStatus } = useSelector((state) => state.user);
  const [section, setSection] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (sessionStatus === "anonymous") router.replace("/login");
  }, [router, sessionStatus]);

  const enrolledCourses = useMemo(
    () => currentUser?.courses || [],
    [currentUser?.courses],
  );
  const courseStats = useMemo(
    () =>
      enrolledCourses.map((course) => ({
        course,
        ...getCourseProgress(course),
      })),
    [enrolledCourses],
  );
  const completedCourses = courseStats.filter(
    (item) => item.course.assessmentResult?.status === "passed",
  ).length;
  const completedLessons = courseStats.reduce(
    (sum, item) => sum + item.completed,
    0,
  );
  const totalLessons = courseStats.reduce((sum, item) => sum + item.total, 0);
  const activeCourse =
    courseStats.find(
      (item) => item.course.assessmentResult?.status !== "passed",
    )?.course || enrolledCourses[0];

  const visibleCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return enrolledCourses.filter((course) => {
      const progress = getCourseProgress(course).percent;
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && course.assessmentResult?.status !== "passed") ||
        (filter === "complete" && course.assessmentResult?.status === "passed");
      const matchesQuery =
        !normalizedQuery ||
        course.name.toLowerCase().includes(normalizedQuery) ||
        course.category.toLowerCase().includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [enrolledCourses, filter, query]);

  async function handleLogout() {
    await axios.get("/api/logout");
    dispatch(logOut());
    router.replace("/");
  }

  function selectSection(id) {
    setSection(id);
    setMobileNavOpen(false);
  }

  if (sessionStatus === "loading" || !currentUser) return <DashboardSkeleton />;

  const firstName = currentUser.name?.split(" ")[0] || "Learner";

  return (
    <div className="min-h-screen bg-[#f6f8f5] text-[#15231c]">
      {mobileNavOpen && (
        <button
          className="fixed inset-0 z-40 bg-[#15231c]/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#dfe6e1] bg-white px-4 py-5 transition-transform duration-300 lg:translate-x-0 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <BrandLogo />
          <button
            onClick={() => setMobileNavOpen(false)}
            className="rounded-lg p-2 text-[#748179] hover:bg-[#edf2ee] lg:hidden"
            aria-label="Close navigation"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-9 space-y-1" aria-label="Dashboard">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => selectSection(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-[#eaf4ee] text-[#145e43]"
                    : "text-[#637069] hover:bg-[#f5f8f6] hover:text-[#15231c]"
                }`}
              >
                <Icon className="h-5 w-5" /> {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div className="mb-4 rounded-2xl bg-gradient-to-br from-[#153e2f] to-[#102d22] p-4 text-white">
            <SparklesIcon className="h-6 w-6 text-[#69a78b]" />
            <p className="mt-3 text-sm font-semibold">Keep your momentum</p>
            <p className="mt-1 text-xs leading-5 text-[#c6d1ca]">
              A little progress every day builds real expertise.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#637069] transition hover:bg-rose-50 hover:text-rose-600"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" /> Sign out
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-[#dfe6e1]/80 bg-white/90 px-4 py-3 backdrop-blur-xl sm:px-7 lg:px-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="rounded-xl border border-[#dfe6e1] p-2.5 text-[#415048] lg:hidden"
              aria-label="Open navigation"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
            <div className="hidden max-w-md flex-1 items-center gap-2 rounded-xl border border-[#dfe6e1] bg-[#f5f8f6] px-3 sm:flex">
              <MagnifyingGlassIcon className="h-5 w-5 text-[#95a099]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setSection("courses")}
                placeholder="Search your courses"
                className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-[#95a099]"
                aria-label="Search your courses"
              />
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-[#15231c]">
                  {currentUser.name}
                </p>
                <p className="max-w-44 truncate text-xs text-[#748179]">
                  {currentUser.email}
                </p>
              </div>
              <ExternalImage
                src={currentUser.photoUrl || "/default-user.png"}
                alt=""
                className="h-10 w-10 rounded-xl border border-[#dfe6e1] object-cover"
              />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-7 lg:px-10 lg:py-10">
          {section === "overview" && (
            <>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-semibold text-[#176b4d]">
                    Your learning space
                  </p>
                  <h1 className="mt-1 font-editorial text-4xl font-semibold tracking-[-.04em] text-[#15231c] sm:text-5xl">
                    Welcome back, {firstName}
                  </h1>
                  <p className="mt-2 text-sm text-[#748179] sm:text-base">
                    Pick up where you left off and keep moving forward.
                  </p>
                </div>
                <button
                  onClick={() => setSection("courses")}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#145e43] hover:text-[#0d422e]"
                >
                  View all courses <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>

              <section
                className="mt-8 grid gap-4 sm:grid-cols-3"
                aria-label="Learning summary"
              >
                {[
                  {
                    label: "Enrolled courses",
                    value: enrolledCourses.length,
                    icon: BookOpenIcon,
                    color: "bg-[#eaf4ee] text-[#176b4d]",
                  },
                  {
                    label: "Lessons completed",
                    value: `${completedLessons}/${totalLessons}`,
                    icon: CheckBadgeIcon,
                    color: "bg-emerald-50 text-emerald-600",
                  },
                  {
                    label: "Certificates earned",
                    value: completedCourses,
                    icon: TrophyIcon,
                    color: "bg-amber-50 text-amber-600",
                  },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-[#dfe6e1] bg-white p-5 shadow-sm"
                    >
                      <div
                        className={`inline-flex rounded-xl p-2.5 ${stat.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="mt-4 text-2xl font-bold text-[#15231c]">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-sm text-[#748179]">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </section>

              <section className="mt-10">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#95a099]">
                      Next up
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-[#15231c]">
                      Continue learning
                    </h2>
                  </div>
                </div>
                {activeCourse ? (
                  <CourseCard course={activeCourse} featured />
                ) : (
                  <EmptyCourses />
                )}
              </section>
            </>
          )}

          {section === "courses" && (
            <section>
              <div>
                <p className="text-sm font-semibold text-[#176b4d]">
                  Course library
                </p>
                <h1 className="mt-1 font-editorial text-4xl font-semibold tracking-[-.04em] text-[#15231c]">
                  My courses
                </h1>
                <p className="mt-2 text-sm text-[#748179]">
                  Everything you are learning, in one focused place.
                </p>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 rounded-xl border border-[#dfe6e1] bg-white px-3 sm:hidden">
                  <MagnifyingGlassIcon className="h-5 w-5 text-[#95a099]" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search your courses"
                    className="w-full py-3 text-sm outline-none"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {[
                    ["all", "All"],
                    ["active", "In progress"],
                    ["complete", "Completed"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setFilter(value)}
                      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                        filter === value
                          ? "bg-[#15231c] text-white"
                          : "border border-[#dfe6e1] bg-white text-[#637069] hover:border-[#c6d1ca]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-[#748179]">
                  {visibleCourses.length} course
                  {visibleCourses.length === 1 ? "" : "s"}
                </p>
              </div>

              {visibleCourses.length ? (
                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {visibleCourses.map((course) => (
                    <CourseCard key={course._id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="mt-6">
                  <EmptyCourses searching={Boolean(query)} />
                </div>
              )}
            </section>
          )}

          {section === "certificates" && <Certificates />}
        </div>
      </main>
    </div>
  );
}

function EmptyCourses({ searching = false }) {
  return (
    <div className="rounded-3xl border border-dashed border-[#c6d1ca] bg-white px-6 py-16 text-center">
      <AcademicCapIcon className="mx-auto h-10 w-10 text-[#c6d1ca]" />
      <h3 className="mt-4 font-bold text-[#15231c]">
        {searching
          ? "No matching courses"
          : "Your learning journey starts here"}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#748179]">
        {searching
          ? "Try a different search or filter."
          : "Explore the catalog and enroll in a course that moves you forward."}
      </p>
      {!searching && (
        <Link
          href="/search_courses"
          className="mt-5 inline-flex rounded-xl bg-[#176b4d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#145e43]"
        >
          Explore courses
        </Link>
      )}
    </div>
  );
}
