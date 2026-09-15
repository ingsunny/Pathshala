"use client";

import {
  ArrowRightIcon,
  BookOpenIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  DocumentTextIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ExternalImage from "@/components/ExternalImage";
import OAuth from "@/components/OAuth";
import { loadingState, signInSuccess } from "@/redux/user/userSlice";

export default function CourseDetailsPage({ params }) {
  const { courseId } = use(params);
  const router = useRouter();
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.courses);
  const { currentUser, loading, sessionStatus } = useSelector(
    (state) => state.user,
  );
  const course = useMemo(
    () => courses.find((item) => item._id === courseId),
    [courseId, courses],
  );
  const enrolled = currentUser?.courses?.some((item) => item._id === courseId);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const totalLessons =
    course?.syllabus?.reduce(
      (sum, chapter) => sum + chapter.topics.length,
      0,
    ) || 0;
  const totalMinutes =
    course?.syllabus
      ?.flatMap((chapter) => chapter.topics)
      .reduce((sum, topic) => sum + (topic.durationMinutes || 12), 0) || 0;

  async function enroll() {
    dispatch(loadingState(true));
    try {
      const response = await axios.post("/api/enroll_course", { courseId });
      dispatch(signInSuccess(response.data.user));
      toast.success("Course added to your learning path");
      router.push("/dashboard");
    } catch (error) {
      if (error.response?.status === 409) router.push("/dashboard");
      else toast.error(error.response?.data?.message || "Unable to enroll");
    } finally {
      dispatch(loadingState(false));
    }
  }

  async function createAndEnroll(event) {
    event.preventDefault();
    dispatch(loadingState(true));
    try {
      await axios.post("/api/signup", formData);
      const response = await axios.post("/api/enroll_course", { courseId });
      dispatch(signInSuccess(response.data.user));
      toast.success("Your Northstar journey is ready");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to create your account",
      );
    } finally {
      dispatch(loadingState(false));
    }
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#fbfcf8]">
        <Header />
        <main className="northstar-shell py-24">
          <div className="h-[560px] animate-pulse rounded-[28px] bg-[#edf1ed]" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfcf8] text-[#15231c]">
      <Header />
      <main>
        <section className="border-b border-[#dfe6e1] bg-[#eef5f0]">
          <div className="northstar-shell grid gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_380px] lg:items-start">
            <div className="max-w-3xl">
              <Link
                href="/search_courses"
                className="text-sm font-bold text-[#647169] hover:text-[#176b4d]"
              >
                ← Course catalog
              </Link>
              <p className="northstar-eyebrow mt-10">
                {course.category} learning path
              </p>
              <h1 className="mt-4 font-editorial text-5xl font-semibold leading-[1.04] tracking-[-.05em] sm:text-6xl">
                {course.name} Course
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f6e66]">
                {course.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  [ClockIcon, course.duration],
                  [BookOpenIcon, `${totalLessons} focused lessons`],
                  [DocumentTextIcon, "Video + written notes"],
                ].map(([Icon, label]) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-[#d3e0d8] bg-white/70 px-4 py-2 text-sm font-semibold text-[#526158]"
                  >
                    <Icon className="h-4 w-4 text-[#176b4d]" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <aside className="rounded-[24px] border border-[#d9e3dc] bg-white p-6 shadow-[0_24px_70px_rgba(26,57,44,.10)]">
              <div className="relative flex aspect-video items-end overflow-hidden rounded-2xl bg-[#153e2f] p-5 text-white">
                <ExternalImage
                  src={course.img1 || "/android.png.webp"}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-45"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102d22] to-transparent" />
                <div className="relative">
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-[#b8dac8]">
                    Start at your pace
                  </p>
                  <p className="mt-2 text-xl font-bold">
                    A complete learning path
                  </p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-xl bg-[#f2f6f3] p-3">
                  <strong className="text-lg">
                    {Math.round(totalMinutes / 60)}h+
                  </strong>
                  <span className="mt-1 block text-xs text-[#708078]">
                    Learning content
                  </span>
                </div>
                <div className="rounded-xl bg-[#f2f6f3] p-3">
                  <strong className="text-lg">
                    {course.finalAssessment?.questionCount || 20}
                  </strong>
                  <span className="mt-1 block text-xs text-[#708078]">
                    Final questions
                  </span>
                </div>
              </div>
              {enrolled ? (
                <Link
                  href="/dashboard"
                  className="northstar-button-primary mt-5 w-full"
                >
                  Continue in dashboard <ArrowRightIcon className="h-4 w-4" />
                </Link>
              ) : currentUser ? (
                <button
                  onClick={enroll}
                  disabled={loading}
                  className="northstar-button-primary mt-5 w-full disabled:opacity-60"
                >
                  {loading ? "Adding course…" : "Enroll for free"}
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              ) : (
                <a
                  href="#enroll"
                  className="northstar-button-primary mt-5 w-full"
                >
                  Create account & enroll <ArrowRightIcon className="h-4 w-4" />
                </a>
              )}
              <p className="mt-3 text-center text-xs text-[#78867e]">
                No payment required for this local release
              </p>
            </aside>
          </div>
        </section>

        <section className="northstar-shell grid gap-14 py-20 lg:grid-cols-[1fr_340px]">
          <div>
            <p className="northstar-eyebrow">What you will learn</p>
            <h2 className="mt-3 font-editorial text-4xl font-semibold tracking-[-.04em]">
              A path designed for understanding.
            </h2>
            <div className="mt-9 space-y-3">
              {course.syllabus.map((chapter, index) => (
                <details
                  key={chapter._id}
                  open={index === 0}
                  className="group rounded-2xl border border-[#dfe6e1] bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-4 p-5 sm:p-6">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#eaf4ee] text-xs font-extrabold text-[#176b4d]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <strong className="block text-base">
                        {chapter.chapter}
                      </strong>
                      <small className="mt-1 block text-[#7a877f]">
                        {chapter.topics.length} lessons
                      </small>
                    </span>
                    <ChevronDownIcon className="h-5 w-5 text-[#859188] transition group-open:rotate-180" />
                  </summary>
                  <div className="border-t border-[#edf1ee] px-5 py-3 sm:px-6">
                    {chapter.topics.map((topic, topicIndex) => (
                      <div
                        key={topic._id}
                        className="flex gap-3 border-b border-[#f0f3f1] py-4 last:border-0"
                      >
                        <PlayCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#4b7f68]" />
                        <div>
                          <p className="text-sm font-bold">{topic.topicName}</p>
                          <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#6d7a73]">
                            {topic.summary}
                          </p>
                          <span className="mt-2 block text-xs font-semibold text-[#89948e]">
                            Lesson {topicIndex + 1} ·{" "}
                            {topic.durationMinutes || 12} min
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
          <div>
            <div className="sticky top-28 rounded-[22px] border border-[#dfe6e1] bg-[#f2f6f3] p-6">
              <CheckBadgeIcon className="h-8 w-8 text-[#176b4d]" />
              <h3 className="mt-5 text-xl font-bold">
                Completion means something.
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#637069]">
                Finish each lesson, then demonstrate your understanding in a
                timed final assessment.
              </p>
              <ul className="mt-5 space-y-3">
                {[
                  `${course.finalAssessment?.durationMinutes || 45}-minute final assessment`,
                  `${course.finalAssessment?.passingScore || 70}% passing score`,
                  `Verifiable PDF certificate`,
                ].map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm font-semibold text-[#4f5e56]"
                  >
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-[#176b4d]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {!currentUser && sessionStatus !== "loading" && (
          <section
            id="enroll"
            className="border-t border-[#dfe6e1] bg-[#153e2f]"
          >
            <div className="northstar-shell grid gap-12 py-16 text-white lg:grid-cols-[1fr_430px] lg:items-center">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#a8d2bb]">
                  Begin your path
                </p>
                <h2 className="mt-4 max-w-xl font-editorial text-4xl font-semibold tracking-[-.04em] sm:text-5xl">
                  Create your free learning account.
                </h2>
                <p className="mt-5 max-w-lg text-base leading-7 text-[#c4d5cc]">
                  Your course, progress, assessment attempts, and certificate
                  stay together in one focused workspace.
                </p>
              </div>
              <div className="rounded-[22px] bg-white p-6 text-[#15231c]">
                <OAuth />
                <div className="my-5 flex items-center gap-3">
                  <i className="h-px flex-1 bg-[#e4eae6]" />
                  <span className="text-xs font-bold text-[#8a958f]">
                    OR USE EMAIL
                  </span>
                  <i className="h-px flex-1 bg-[#e4eae6]" />
                </div>
                <form onSubmit={createAndEnroll} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      required
                      name="firstName"
                      value={formData.firstName}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          [event.target.name]: event.target.value,
                        })
                      }
                      placeholder="First name"
                      className="northstar-input"
                    />
                    <input
                      required
                      name="lastName"
                      value={formData.lastName}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          [event.target.name]: event.target.value,
                        })
                      }
                      placeholder="Last name"
                      className="northstar-input"
                    />
                  </div>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        [event.target.name]: event.target.value,
                      })
                    }
                    placeholder="Email address"
                    className="northstar-input"
                  />
                  <input
                    required
                    minLength={8}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        [event.target.name]: event.target.value,
                      })
                    }
                    placeholder="Password (8+ characters)"
                    className="northstar-input"
                  />
                  <button
                    disabled={loading}
                    className="northstar-button-primary w-full disabled:opacity-60"
                  >
                    {loading
                      ? "Creating your account…"
                      : "Create account & enroll"}
                  </button>
                </form>
                <p className="mt-4 text-center text-xs text-[#7b8881]">
                  Already have an account?{" "}
                  <Link href="/login" className="font-bold text-[#176b4d]">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}
