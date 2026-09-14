"use client";

import {
  ArrowLeftIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

export default function CourseSearchPage() {
  const courses = useSelector((state) => state.courses.courses);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = useMemo(
    () => ["All", ...new Set(courses.map((course) => course.category))],
    [courses]
  );
  const filteredCourses = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return courses.filter(
      (course) =>
        (category === "All" || course.category === category) &&
        (!normalized ||
          course.name.toLowerCase().includes(normalized) ||
          course.category.toLowerCase().includes(normalized) ||
          course.description.toLowerCase().includes(normalized))
    );
  }, [category, courses, query]);

  return (
    <main className="min-h-screen bg-[#f6f8fc] px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
          <ArrowLeftIcon className="h-4 w-4" /> Back home
        </Link>

        <section className="mt-8 rounded-3xl bg-slate-950 px-6 py-10 text-white sm:px-10 sm:py-12">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300">
            <SparklesIcon className="h-5 w-5" /> Find your next skill
          </span>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">What do you want to learn?</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Explore practical, self-paced courses built to help you make measurable progress.
          </p>
          <label className="mt-8 flex max-w-2xl items-center gap-3 rounded-2xl bg-white px-4 text-slate-900 shadow-xl">
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
            <span className="sr-only">Search courses</span>
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by course or category"
              className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-slate-400 sm:text-base"
            />
          </label>
        </section>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                category === item
                  ? "bg-sky-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Course catalog</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">{query ? "Search results" : "Popular courses"}</h2>
          </div>
          <span className="text-sm text-slate-500">{filteredCourses.length} found</span>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Link
                key={course._id}
                href={`/categories/${course._id}`}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img src={course.img1 || "/android.png.webp"} alt="" className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                  <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-700">{course.category}</span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-950 group-hover:text-sky-700">{course.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{course.description}</p>
                  <span className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <ClockIcon className="h-4 w-4" /> {course.duration}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <MagnifyingGlassIcon className="mx-auto h-9 w-9 text-slate-300" />
            <h3 className="mt-4 font-bold text-slate-900">No matching courses</h3>
            <p className="mt-2 text-sm text-slate-500">Try a broader search or choose another category.</p>
          </div>
        )}
      </div>
    </main>
  );
}
