"use client";

import {
  ArrowRightIcon,
  BookOpenIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSelector } from "react-redux";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExternalImage from "@/components/ExternalImage";

function CourseCard({ course }) {
  const lessons =
    course.syllabus?.reduce(
      (count, chapter) => count + chapter.topics.length,
      0,
    ) || 0;
  return (
    <Link
      href={`/categories/${course._id}`}
      className="group overflow-hidden rounded-[22px] border border-[#dfe6e1] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(26,57,44,.12)]"
    >
      <div className="relative h-48 overflow-hidden bg-[#173e2f]">
        <ExternalImage
          src={course.img1 || "/android.png.webp"}
          alt=""
          className="h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10281f]/80 via-transparent to-transparent" />
        <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#315b49]">
          {course.category}
        </span>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4 text-xs font-semibold text-[#748179]">
          <span className="flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpenIcon className="h-4 w-4" />
            {lessons} lessons
          </span>
        </div>
        <h3 className="mt-4 text-xl font-bold tracking-[-.025em] text-[#15231c] group-hover:text-[#176b4d]">
          {course.name}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#637069]">
          {course.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#176b4d]">
          Explore course{" "}
          <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const courses = useSelector((state) => state.courses.courses);
  return (
    <div className="bg-[#fbfcf8] text-[#15231c]">
      <Header />
      <main>
        <section className="northstar-shell grid items-center gap-14 py-16 sm:py-24 lg:grid-cols-[1.08fr_.92fr] lg:py-28">
          <div>
            <p className="northstar-eyebrow">Learning that moves with you</p>
            <h1 className="mt-5 max-w-3xl font-editorial text-5xl font-semibold leading-[1.03] tracking-[-.05em] sm:text-6xl lg:text-[72px]">
              Build skills that change what comes next.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#637069]">
              Focused courses, clear explanations, and meaningful proof of
              progress. Everything you need to move from curious to capable.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/search_courses" className="northstar-button-primary">
                Explore courses <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <a href="#how-it-works" className="northstar-button-secondary">
                See how it works
              </a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-[#6f7d75]">
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-[#176b4d]" />
                60 focused lessons
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-[#176b4d]" />
                Course-specific tests
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-[#176b4d]" />
                Verified certificates
              </span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-8 rounded-full bg-[#d9eee1]/65 blur-3xl" />
            <div className="relative rounded-[26px] border border-[#dce6df] bg-white p-4 shadow-[0_28px_80px_rgba(26,57,44,.14)]">
              <div className="flex items-center gap-1.5 px-1 pb-4">
                <i className="h-2 w-2 rounded-full bg-[#dfe6e1]" />
                <i className="h-2 w-2 rounded-full bg-[#dfe6e1]" />
                <i className="h-2 w-2 rounded-full bg-[#dfe6e1]" />
                <span className="ml-auto text-[11px] font-bold uppercase tracking-wider text-[#849088]">
                  Learning workspace
                </span>
              </div>
              <div className="relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-[19px] bg-gradient-to-br from-[#176b4d] to-[#102d22] p-7 text-white">
                <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[50px] border-white/10" />
                <span className="relative text-xs font-bold uppercase tracking-[.16em] text-[#a9d8c0]">
                  Continue learning
                </span>
                <strong className="relative mt-3 max-w-xs text-3xl leading-tight">
                  How Python programs work
                </strong>
                <div className="relative mt-8 flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#176b4d]">
                    <PlayIcon className="ml-0.5 h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold">Resume lesson</span>
                </div>
              </div>
              <div className="px-2 pb-2 pt-5">
                <div className="flex justify-between text-xs font-semibold text-[#637069]">
                  <span>12 of 20 lessons</span>
                  <span>60%</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#eaf0ec]">
                  <div className="h-full w-3/5 rounded-full bg-[#176b4d]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#e2e9e4] bg-white">
          <div className="northstar-shell grid gap-7 py-7 text-sm font-semibold text-[#59675f] sm:grid-cols-3">
            <span className="text-center">Built for self-paced focus</span>
            <span className="text-center sm:border-x sm:border-[#e2e9e4]">
              Beginner to intermediate pathways
            </span>
            <span className="text-center">Evidence-backed achievement</span>
          </div>
        </section>

        <section id="courses" className="northstar-shell py-20 sm:py-28">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="northstar-eyebrow">Choose your direction</p>
              <h2 className="mt-3 font-editorial text-4xl font-semibold tracking-[-.04em] sm:text-5xl">
                Skills worth building.
              </h2>
            </div>
            <Link
              href="/search_courses"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#176b4d]"
            >
              View every course <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          {courses.length ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-96 animate-pulse rounded-[22px] bg-[#edf1ed]"
                />
              ))}
            </div>
          )}
        </section>

        <section id="how-it-works" className="bg-[#f0f5f1]">
          <div className="northstar-shell py-20 sm:py-28">
            <div className="max-w-2xl">
              <p className="northstar-eyebrow">A clearer way forward</p>
              <h2 className="mt-3 font-editorial text-4xl font-semibold tracking-[-.04em] sm:text-5xl">
                Learning, without the noise.
              </h2>
              <p className="mt-5 text-base leading-7 text-[#637069]">
                Every part of Northstar answers one question at a time: what to
                learn, what matters, and what to do next.
              </p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {[
                [
                  BookOpenIcon,
                  "01",
                  "Follow a focused path",
                  "Move through a genuine beginner-to-intermediate curriculum, organized around useful outcomes.",
                ],
                [
                  DocumentTextIcon,
                  "02",
                  "Watch and understand",
                  "Use a purpose-built player, then reinforce every topic through clear written explanations.",
                ],
                [
                  CheckBadgeIcon,
                  "03",
                  "Prove your progress",
                  "Complete a timed final assessment and earn a verifiable certificate when you pass.",
                ],
              ].map(([Icon, number, title, copy]) => (
                <article
                  key={title}
                  className="rounded-[22px] border border-[#dce5df] bg-[#fbfcf8] p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#e3f0e8] text-[#176b4d]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-extrabold text-[#9aa69f]">
                      {number}
                    </span>
                  </div>
                  <h3 className="mt-8 text-xl font-bold tracking-[-.025em]">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#637069]">
                    {copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="northstar-shell py-20 sm:py-28">
          <div className="overflow-hidden rounded-[30px] bg-[#163e2f] px-7 py-12 text-white sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#a5d2ba]">
                Your next chapter
              </p>
              <h2 className="mt-4 font-editorial text-4xl font-semibold tracking-[-.04em] sm:text-5xl">
                Start with one useful skill.
              </h2>
              <p className="mt-5 text-base leading-7 text-[#c5d6cd]">
                Choose a course. Keep a steady rhythm. Let visible progress
                compound.
              </p>
            </div>
            <Link
              href="/search_courses"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-[#164a36] lg:mt-0"
            >
              Find your course <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
