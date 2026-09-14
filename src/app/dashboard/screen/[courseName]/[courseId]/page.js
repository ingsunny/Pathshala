"use client";

import {
  ArrowLeftIcon,
  Bars3Icon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  DocumentTextIcon,
  ListBulletIcon,
  PlayCircleIcon,
  TrophyIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolidIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CourseVideoPlayer from "@/components/learning/CourseVideoPlayer";
import FinalAssessment from "@/components/learning/FinalAssessment";
import { signInSuccess } from "@/redux/user/userSlice";

const COURSE_VIDEO_URL = "https://s3.toosio.com/t/pathshala/videoplayback.mp4";

function flattenLessons(course) {
  return (course?.syllabus || []).flatMap((chapter, moduleIndex) =>
    (chapter.topics || []).map((topic, lessonIndex) => ({
      ...topic,
      chapter: chapter.chapter,
      moduleIndex,
      lessonIndex,
    }))
  );
}

function LearningSkeleton() {
  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-8" aria-busy="true">
      <div className="mx-auto max-w-[1600px] animate-pulse">
        <div className="h-16 rounded-2xl bg-slate-200" />
        <div className="mt-5 grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <div className="hidden h-[70vh] rounded-2xl bg-slate-200 lg:block" />
          <div className="aspect-video rounded-2xl bg-slate-300" />
        </div>
      </div>
      <span className="sr-only">Loading your course</span>
    </main>
  );
}

export default function CourseLearningPage({ params }) {
  const { courseId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const pendingProgress = useRef(new Set());
  const { currentUser, sessionStatus } = useSelector((state) => state.user);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [curriculumOpen, setCurriculumOpen] = useState(false);
  const [advance, setAdvance] = useState(null);
  const [progressSaving, setProgressSaving] = useState(false);
  const [assessmentOpen, setAssessmentOpen] = useState(searchParams.get("assessment") === "1");

  useEffect(() => {
    if (sessionStatus === "anonymous") router.replace("/login");
  }, [router, sessionStatus]);

  const course = useMemo(
    () => currentUser?.courses?.find((item) => item._id === courseId),
    [currentUser, courseId]
  );
  const lessons = useMemo(() => flattenLessons(course), [course]);
  const firstIncompleteIndex = lessons.findIndex((lesson) => !lesson.topicProgress);
  const requestedIndex = lessons.findIndex((lesson) => lesson._id === selectedTopicId);
  const selectedIndex = requestedIndex >= 0 ? requestedIndex : Math.max(firstIncompleteIndex, 0);
  const currentLesson = lessons[selectedIndex];
  const completedCount = lessons.filter((lesson) => lesson.topicProgress).length;
  const progressPercent = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;
  const allLessonsComplete = lessons.length > 0 && completedCount === lessons.length;
  const nextLesson = lessons[selectedIndex + 1];
  const previousLesson = lessons[selectedIndex - 1];

  useEffect(() => {
    if (!advance) return;
    const timer = setTimeout(() => {
      if (advance.seconds <= 1) {
        const next = lessons[advance.nextIndex];
        if (next) setSelectedTopicId(next._id);
        setAdvance(null);
      } else {
        setAdvance({ ...advance, seconds: advance.seconds - 1 });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [advance, lessons]);

  async function markLessonComplete(lesson) {
    if (!lesson || lesson.topicProgress || pendingProgress.current.has(lesson._id)) return;

    pendingProgress.current.add(lesson._id);
    setProgressSaving(true);
    try {
      const response = await axios.post("/api/course_progress", {
        courseId,
        topicId: lesson._id,
      });
      dispatch(signInSuccess(response.data.user));
    } catch (error) {
      console.error("Unable to save lesson progress", error);
    } finally {
      pendingProgress.current.delete(lesson._id);
      setProgressSaving(false);
    }
  }

  async function handleVideoEnded() {
    await markLessonComplete(currentLesson);
    if (nextLesson) {
      setAdvance({ seconds: 5, nextIndex: selectedIndex + 1 });
    }
  }

  async function moveNext() {
    setAdvance(null);
    await markLessonComplete(currentLesson);
    if (nextLesson) setSelectedTopicId(nextLesson._id);
  }

  function selectLesson(lesson) {
    setAdvance(null);
    setAssessmentOpen(false);
    setSelectedTopicId(lesson._id);
    setCurriculumOpen(false);
  }

  if (sessionStatus === "loading" || !currentUser) return <LearningSkeleton />;

  if (!course || !currentLesson) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Course unavailable</h1>
          <p className="mt-2 text-slate-500">This course is not part of your current enrollment.</p>
          <Link href="/dashboard" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
            Return to dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fa] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 sm:px-6">
          <Link
            href="/dashboard"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            aria-label="Back to dashboard"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-950">{course.name}</p>
            <p className="truncate text-xs text-slate-500">{assessmentOpen ? "Final assessment" : currentLesson.chapter}</p>
          </div>
          <div className="ml-auto hidden w-56 items-center gap-3 sm:flex">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-sky-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="text-xs font-bold tabular-nums text-slate-600">{progressPercent}%</span>
          </div>
          <button
            onClick={() => setCurriculumOpen(true)}
            className="ml-1 grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 lg:hidden"
            aria-label="Open course curriculum"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
        </div>
      </header>

      {curriculumOpen && (
        <button
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setCurriculumOpen(false)}
          aria-label="Close curriculum"
        />
      )}

      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[min(90vw,340px)] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:sticky lg:top-16 lg:z-20 lg:h-[calc(100vh-4rem)] lg:w-auto lg:translate-x-0 ${
            curriculumOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 lg:hidden">
            <span className="font-bold">Course curriculum</span>
            <button onClick={() => setCurriculumOpen(false)} className="rounded-lg p-2 text-slate-500" aria-label="Close curriculum">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="border-b border-slate-100 px-5 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">Your progress</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{completedCount} of {lessons.length} lessons</p>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-sky-50 text-sm font-bold text-sky-700">{progressPercent}%</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3">
            {course.syllabus.map((chapter, moduleIndex) => (
              <details key={chapter._id} open={moduleIndex === currentLesson.moduleIndex} className="group mb-2">
                <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50">
                  <span className="pr-3"><span className="mr-2 text-xs text-slate-400">{String(moduleIndex + 1).padStart(2, "0")}</span>{chapter.chapter}</span>
                  <ChevronDownIcon className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-180" />
                </summary>
                <div className="mt-1 space-y-1 pb-2">
                  {chapter.topics.map((lesson, lessonIndex) => {
                    const active = lesson._id === currentLesson._id;
                    return (
                      <button
                        key={lesson._id}
                        onClick={() => selectLesson(lesson)}
                        className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${
                          active ? "bg-sky-50 text-sky-800" : "text-slate-600 hover:bg-slate-50"
                        }`}
                        aria-current={active ? "true" : undefined}
                      >
                        {lesson.topicProgress ? (
                          <CheckCircleSolidIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                        ) : active ? (
                          <PlayCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
                        ) : (
                          <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border border-slate-300 text-[9px] font-bold">
                            {lessonIndex + 1}
                          </span>
                        )}
                        <span>
                          <span className="block text-sm font-medium leading-5">{lesson.topicName}</span>
                          <span className="mt-1 block text-[11px] text-slate-400">Video lesson</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </details>
            ))}
            <button
              onClick={() => { setAssessmentOpen(true); setCurriculumOpen(false); setAdvance(null); }}
              className={`mt-3 flex w-full items-start gap-3 rounded-xl border px-3 py-4 text-left transition ${
                assessmentOpen ? "border-indigo-200 bg-indigo-50 text-indigo-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <TrophyIcon className={`mt-0.5 h-5 w-5 shrink-0 ${allLessonsComplete ? "text-amber-500" : "text-slate-400"}`} />
              <span>
                <span className="block text-sm font-bold">Final assessment</span>
                <span className="mt-1 block text-[11px] text-slate-400">{allLessonsComplete ? `${course.finalAssessment?.questionCount || 20} questions • 45 minutes` : "Complete all lessons to unlock"}</span>
              </span>
            </button>
          </div>
        </aside>

        <main className="min-w-0 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 xl:px-12">
          <div className="mx-auto max-w-6xl">
            {assessmentOpen ? (
              <FinalAssessment
                courseId={courseId}
                courseName={course.name}
                metadata={course.finalAssessment}
                result={course.assessmentResult}
                unlocked={allLessonsComplete}
              />
            ) : (
              <>
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
              <ListBulletIcon className="h-4 w-4" />
              <span>Lesson {selectedIndex + 1} of {lessons.length}</span>
              {progressSaving && <span className="ml-auto text-sky-600">Saving progress…</span>}
            </div>

            <CourseVideoPlayer
              key={currentLesson._id}
              src={COURSE_VIDEO_URL}
              title={currentLesson.topicName}
              poster={course.img2 || course.img1}
              onEnded={handleVideoEnded}
            />

            {advance && (
              <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 sm:flex-row sm:items-center">
                <CheckCircleIcon className="h-6 w-6 shrink-0 text-emerald-600" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900">Lesson complete</p>
                  <p className="truncate text-sm text-slate-600">Next: {nextLesson?.topicName} in {advance.seconds} seconds</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setAdvance(null)} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-white">Cancel</button>
                  <button onClick={() => { setSelectedTopicId(nextLesson._id); setAdvance(null); }} className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700">Play next</button>
                </div>
              </div>
            )}

            <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">{currentLesson.chapter}</p>
                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{currentLesson.topicName}</h1>
                  <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5"><ClockIcon className="h-4 w-4" /> Self-paced</span>
                    {currentLesson.topicProgress && <span className="flex items-center gap-1.5 text-emerald-600"><CheckCircleIcon className="h-4 w-4" /> Completed</span>}
                  </div>
                </div>
                <button
                  onClick={() => markLessonComplete(currentLesson)}
                  disabled={currentLesson.topicProgress || progressSaving}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-default disabled:bg-slate-50 disabled:text-slate-400"
                >
                  {currentLesson.topicProgress ? "Completed" : "Mark complete"}
                </button>
              </div>

              <div className="mt-7 grid gap-5 border-t border-slate-100 pt-6 lg:grid-cols-[1fr_300px]">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950"><DocumentTextIcon className="h-5 w-5 text-sky-600" /> Lesson summary</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{currentLesson.summary || "A detailed written explanation for this lesson is being prepared."}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5">
                  <h3 className="text-sm font-bold text-slate-900">Key takeaways</h3>
                  <ul className="mt-3 space-y-2">
                    {(currentLesson.keyPoints || []).map((point) => <li key={point} className="flex gap-2 text-sm leading-5 text-slate-600"><CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{point}</li>)}
                  </ul>
                </div>
              </div>

              <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
                <button
                  onClick={() => previousLesson && selectLesson(previousLesson)}
                  disabled={!previousLesson}
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:invisible"
                >
                  <ChevronLeftIcon className="h-4 w-4" /> Previous
                </button>
                {nextLesson ? (
                  <button
                    onClick={moveNext}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
                  >
                    Complete & next <ChevronRightIcon className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={async () => { await markLessonComplete(currentLesson); setAssessmentOpen(true); }}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Complete & take final test <TrophyIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </section>

              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
