"use client";

import {
  ArrowRightIcon,
  BookOpenIcon,
  ClockIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ExternalImage from "@/components/ExternalImage";

export default function CourseSearchPage() {
  const courses = useSelector((state) => state.courses.courses);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = useMemo(
    () => ["All", ...new Set(courses.map((course) => course.category))],
    [courses],
  );
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return courses.filter(
      (course) =>
        (category === "All" || course.category === category) &&
        (!term ||
          [course.name, course.category, course.description].some((value) =>
            value.toLowerCase().includes(term),
          )),
    );
  }, [category, courses, query]);

  return (
    <div className="min-h-screen bg-[#fbfcf8]">
      <Header />
      <main>
        <section className="border-b border-[#dfe6e1] bg-[#eef5f0]">
          <div className="northstar-shell py-14 sm:py-20">
            <p className="northstar-eyebrow">Course catalog</p>
            <h1 className="mt-4 max-w-3xl font-editorial text-5xl font-semibold tracking-[-.05em] sm:text-6xl">
              What do you want to learn?
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#637069]">
              Choose a focused path and move from first principles to confident
              practice.
            </p>
            <label className="mt-9 flex max-w-2xl items-center gap-3 rounded-2xl border border-[#d4e0d8] bg-white px-4 shadow-[0_12px_35px_rgba(26,57,44,.07)]">
              <MagnifyingGlassIcon className="h-5 w-5 text-[#75847c]" />
              <span className="sr-only">Search courses</span>
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by course or category"
                className="w-full bg-transparent py-4 text-sm text-[#26362e] outline-none placeholder:text-[#8c9891]"
              />
            </label>
          </div>
        </section>
        <section className="northstar-shell py-12 sm:py-16">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${category === item ? "bg-[#176b4d] text-white" : "border border-[#dce5df] bg-white text-[#5d6b63] hover:border-[#acc3b6]"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-8 flex items-end justify-between">
            <div>
              <p className="northstar-eyebrow">
                {query ? "Matching paths" : "All learning paths"}
              </p>
              <h2 className="mt-2 font-editorial text-3xl font-semibold tracking-[-.035em]">
                {query ? "Search results" : "Build what comes next"}
              </h2>
            </div>
            <span className="text-sm font-semibold text-[#7c8881]">
              {filtered.length} found
            </span>
          </div>
          {filtered.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((course) => {
                const lessons =
                  course.syllabus?.reduce(
                    (sum, chapter) => sum + chapter.topics.length,
                    0,
                  ) || 0;
                return (
                  <Link
                    key={course._id}
                    href={`/categories/${course._id}`}
                    className="group overflow-hidden rounded-[22px] border border-[#dfe6e1] bg-white transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(26,57,44,.12)]"
                  >
                    <div className="relative h-48 overflow-hidden bg-[#153e2f]">
                      <ExternalImage
                        src={course.img1 || "/android.png.webp"}
                        alt={`${course.name} course`}
                        className="h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#102d22]/80 to-transparent" />
                      <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#315b49]">
                        {course.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex gap-4 text-xs font-semibold text-[#78857e]">
                        <span className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpenIcon className="h-4 w-4" />
                          {lessons} lessons
                        </span>
                      </div>
                      <h3 className="mt-4 text-xl font-bold tracking-[-.025em]">
                        {course.name}
                      </h3>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#637069]">
                        {course.description}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#176b4d]">
                        View learning path{" "}
                        <ArrowRightIcon className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-[22px] border border-dashed border-[#cbd8d0] bg-white px-6 py-16 text-center">
              <MagnifyingGlassIcon className="mx-auto h-8 w-8 text-[#aab6af]" />
              <h3 className="mt-4 font-bold">No matching courses</h3>
              <p className="mt-2 text-sm text-[#748179]">
                Try a broader search or another category.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
