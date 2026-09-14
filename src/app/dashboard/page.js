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
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Certificates from "@/components/Certificates";
import { logOut } from "@/redux/user/userSlice";

const navigation = [
  { id: "overview", label: "Overview", icon: HomeIcon },
  { id: "courses", label: "My courses", icon: BookOpenIcon },
  { id: "certificates", label: "Certificates", icon: TrophyIcon },
];

function getCourseProgress(course) {
  const topics = course.syllabus?.flatMap((chapter) => chapter.topics || []) || [];
  const completed = topics.filter((topic) => topic.topicProgress).length;
  const percent = topics.length ? Math.round((completed / topics.length) * 100) : 0;
  return { total: topics.length, completed, percent };
}

function courseHref(course) {
  const slug = course.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `/dashboard/screen/${slug}/${course._id}`;
}

function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 lg:pl-[19.5rem]" aria-busy="true">
      <div className="mx-auto max-w-7xl animate-pulse space-y-8">
        <div className="h-16 rounded-2xl bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-32 rounded-2xl bg-slate-200" />
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="h-80 rounded-3xl bg-slate-200" />
          <div className="h-80 rounded-3xl bg-slate-200" />
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
      className={`group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 ${
        featured ? "lg:grid lg:grid-cols-[1.1fr_1fr]" : ""
      }`}
    >
      <div className={`relative overflow-hidden bg-slate-900 ${featured ? "min-h-64" : "h-44"}`}>
        <img
          src={course.img1 || "/android.png.webp"}
          alt=""
          className="h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
          {course.category}
        </span>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
          <span className="flex items-center gap-1.5 text-sm font-medium">
            <ClockIcon className="h-4 w-4" /> {course.duration}
          </span>
          <span className="rounded-full bg-sky-500 px-2.5 py-1 text-xs font-bold">
            {progress.percent}%
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-between p-5 sm:p-6">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-600">
            {assessmentPassed
              ? "Course completed"
              : lessonsFinished
                ? "Final test ready"
                : progress.completed === 0
              ? "Ready to start"
              : "Continue learning"}
          </p>
          <h3 className="text-xl font-bold tracking-tight text-slate-900">{course.name}</h3>
          {featured && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
              {course.description}
            </p>
          )}
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
            <span>{progress.completed} of {progress.total} lessons complete</span>
            <span>{progress.percent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <Link
            href={`${courseHref(course)}${lessonsFinished && !assessmentPassed ? "?assessment=1" : ""}`}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            <PlayIcon className="h-4 w-4" />
            {assessmentPassed ? "Review course" : lessonsFinished ? "Take final test" : progress.completed === 0 ? "Start course" : "Resume course"}
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

  const enrolledCourses = useMemo(() => currentUser?.courses || [], [currentUser?.courses]);
  const courseStats = useMemo(
    () => enrolledCourses.map((course) => ({ course, ...getCourseProgress(course) })),
    [enrolledCourses]
  );
  const completedCourses = courseStats.filter((item) => item.course.assessmentResult?.status === "passed").length;
  const completedLessons = courseStats.reduce((sum, item) => sum + item.completed, 0);
  const totalLessons = courseStats.reduce((sum, item) => sum + item.total, 0);
  const activeCourse = courseStats.find((item) => item.course.assessmentResult?.status !== "passed")?.course || enrolledCourses[0];

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
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">
      {mobileNavOpen && (
        <button
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white px-4 py-5 transition-transform duration-300 lg:translate-x-0 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <Link href="/" aria-label="Pathshala home">
            <Image
              src="/newLogo.png"
              width={142}
              height={39}
              alt="Pathshala"
              className="h-auto w-[142px]"
              priority
            />
          </Link>
          <button
            onClick={() => setMobileNavOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
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
                    ? "bg-sky-50 text-sky-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <Icon className="h-5 w-5" /> {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div className="mb-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-800 p-4 text-white">
            <SparklesIcon className="h-6 w-6 text-sky-400" />
            <p className="mt-3 text-sm font-semibold">Keep your momentum</p>
            <p className="mt-1 text-xs leading-5 text-slate-300">
              A little progress every day builds real expertise.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" /> Sign out
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-xl sm:px-7 lg:px-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-700 lg:hidden"
              aria-label="Open navigation"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
            <div className="hidden max-w-md flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 sm:flex">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setSection("courses")}
                placeholder="Search your courses"
                className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-slate-400"
                aria-label="Search your courses"
              />
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-900">{currentUser.name}</p>
                <p className="max-w-44 truncate text-xs text-slate-500">{currentUser.email}</p>
              </div>
              <img
                src={currentUser.photoUrl || "/default-user.png"}
                alt=""
                className="h-10 w-10 rounded-xl border border-slate-200 object-cover"
              />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-7 lg:px-10 lg:py-10">
          {section === "overview" && (
            <>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-semibold text-sky-600">Your learning space</p>
                  <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                    Welcome back, {firstName}
                  </h1>
                  <p className="mt-2 text-sm text-slate-500 sm:text-base">
                    Pick up where you left off and keep moving forward.
                  </p>
                </div>
                <button
                  onClick={() => setSection("courses")}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700 hover:text-sky-900"
                >
                  View all courses <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>

              <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Learning summary">
                {[
                  { label: "Enrolled courses", value: enrolledCourses.length, icon: BookOpenIcon, color: "bg-sky-50 text-sky-600" },
                  { label: "Lessons completed", value: `${completedLessons}/${totalLessons}`, icon: CheckBadgeIcon, color: "bg-emerald-50 text-emerald-600" },
                  { label: "Certificates earned", value: completedCourses, icon: TrophyIcon, color: "bg-amber-50 text-amber-600" },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className={`inline-flex rounded-xl p-2.5 ${stat.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="mt-4 text-2xl font-bold text-slate-950">{stat.value}</p>
                      <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
                    </div>
                  );
                })}
              </section>

              <section className="mt-10">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Next up</p>
                    <h2 className="mt-1 text-xl font-bold text-slate-950">Continue learning</h2>
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
                <p className="text-sm font-semibold text-sky-600">Course library</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">My courses</h1>
                <p className="mt-2 text-sm text-slate-500">Everything you are learning, in one focused place.</p>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 sm:hidden">
                  <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
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
                          ? "bg-slate-950 text-white"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-slate-500">{visibleCourses.length} course{visibleCourses.length === 1 ? "" : "s"}</p>
              </div>

              {visibleCourses.length ? (
                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {visibleCourses.map((course) => <CourseCard key={course._id} course={course} />)}
                </div>
              ) : (
                <div className="mt-6"><EmptyCourses searching={Boolean(query)} /></div>
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
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <AcademicCapIcon className="mx-auto h-10 w-10 text-slate-300" />
      <h3 className="mt-4 font-bold text-slate-900">
        {searching ? "No matching courses" : "Your learning journey starts here"}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {searching ? "Try a different search or filter." : "Explore the catalog and enroll in a course that moves you forward."}
      </p>
      {!searching && (
        <Link href="/search_courses" className="mt-5 inline-flex rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700">
          Explore courses
        </Link>
      )}
    </div>
  );
}
