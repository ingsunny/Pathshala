"use client";

import {
  ArrowPathIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ClockIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { signInSuccess } from "@/redux/user/userSlice";

function formatRemaining(seconds) {
  const safe = Math.max(0, seconds);
  return `${Math.floor(safe / 60)
    .toString()
    .padStart(2, "0")}:${(safe % 60).toString().padStart(2, "0")}`;
}

export default function FinalAssessment({
  courseId,
  courseName,
  metadata,
  result,
  unlocked,
}) {
  const dispatch = useDispatch();
  const submittingRef = useRef(false);
  const [stage, setStage] = useState(
    result?.status === "passed" ? "result" : "intro",
  );
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [expiresAt, setExpiresAt] = useState(null);
  const [remaining, setRemaining] = useState(
    metadata?.durationMinutes * 60 || 2700,
  );
  const [outcome, setOutcome] = useState(
    result?.status === "passed"
      ? { passed: true, score: result.bestScore }
      : null,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const progress = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;
  const payload = useMemo(
    () =>
      questions.flatMap((question) =>
        answers[question.id] === undefined
          ? []
          : [{ questionId: question.id, option: answers[question.id] }],
      ),
    [answers, questions],
  );

  const submitAssessment = useCallback(async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/api/assessment", {
        action: "submit",
        courseId,
        answers: payload,
      });
      if (response.data.user) dispatch(signInSuccess(response.data.user));
      setOutcome(response.data);
      setStage("result");
    } catch (requestError) {
      const data = requestError.response?.data;
      if (requestError.response?.status === 408) {
        setOutcome({
          passed: false,
          score: 0,
          passingScore: metadata.passingScore,
          timedOut: true,
        });
        setStage("result");
      } else {
        setError(data?.message || "The assessment could not be submitted.");
      }
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  }, [courseId, dispatch, metadata, payload]);

  useEffect(() => {
    if (stage !== "taking" || !expiresAt) return;
    const update = () => {
      const seconds = Math.max(
        0,
        Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000),
      );
      setRemaining(seconds);
      if (seconds === 0) submitAssessment();
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [expiresAt, stage, submitAssessment]);

  async function startAssessment() {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/api/assessment", {
        action: "start",
        courseId,
      });
      if (response.data.status === "passed") {
        setOutcome({ passed: true, score: response.data.score });
        setStage("result");
        return;
      }
      setQuestions(response.data.questions);
      setExpiresAt(response.data.expiresAt);
      setStage("taking");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "The assessment could not be started.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!unlocked) {
    return (
      <section className="rounded-3xl border border-[#dfe6e1] bg-white p-7 text-center shadow-sm sm:p-12">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#edf2ee] text-[#748179]">
          <LockClosedIcon className="h-7 w-7" />
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#95a099]">
          Final step locked
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[#15231c]">
          Complete all lessons first
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#637069]">
          Your final assessment unlocks when every video lesson is marked
          complete.
        </p>
      </section>
    );
  }

  if (stage === "intro") {
    return (
      <section className="overflow-hidden rounded-3xl border border-[#d4e3da] bg-white shadow-sm">
        <div className="bg-gradient-to-br from-[#153e2f] via-[#173b2e] to-[#0d422e] px-7 py-10 text-white sm:px-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-[#cce3d7]">
            <CheckBadgeIcon className="h-4 w-4" /> Final course assessment
          </span>
          <h1 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            {metadata?.title || `${courseName} Final Assessment`}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#c6d1ca]">
            Demonstrate what you learned across the complete course. Your
            certificate is issued locally after you pass.
          </p>
        </div>
        <div className="grid gap-6 p-7 sm:grid-cols-3 sm:p-10">
          {[
            `${metadata?.questionCount || 20} multiple-choice questions`,
            `${metadata?.durationMinutes || 45} minute time limit`,
            `${metadata?.passingScore || 70}% required to pass`,
          ].map((item, index) => (
            <div key={item} className="rounded-2xl bg-[#f5f8f6] p-5">
              <span className="text-xs font-bold text-[#176b4d]">
                0{index + 1}
              </span>
              <p className="mt-2 text-sm font-semibold text-[#26362e]">
                {item}
              </p>
            </div>
          ))}
          <div className="sm:col-span-3 flex flex-col gap-3 border-t border-[#edf2ee] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-[#748179]">
              The timer starts immediately. Unanswered questions are marked
              incorrect, and you may retry if needed.
            </p>
            <button
              onClick={startAssessment}
              disabled={loading}
              className="shrink-0 rounded-xl bg-[#176b4d] px-6 py-3 text-sm font-bold text-white hover:bg-[#145e43] disabled:opacity-60"
            >
              {loading
                ? "Preparing test…"
                : result?.status === "failed"
                  ? "Retry assessment"
                  : "Start 45-minute test"}
            </button>
          </div>
          {error && (
            <p className="sm:col-span-3 text-sm text-rose-600">{error}</p>
          )}
        </div>
      </section>
    );
  }

  if (stage === "result") {
    const passed = outcome?.passed;
    return (
      <section
        className={`rounded-3xl border bg-white p-7 text-center shadow-sm sm:p-12 ${passed ? "border-emerald-200" : "border-amber-200"}`}
      >
        <div
          className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${passed ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}
        >
          {passed ? (
            <CheckCircleIcon className="h-9 w-9" />
          ) : (
            <ArrowPathIcon className="h-8 w-8" />
          )}
        </div>
        <p
          className={`mt-5 text-xs font-bold uppercase tracking-[0.18em] ${passed ? "text-emerald-700" : "text-amber-700"}`}
        >
          {passed
            ? "Assessment passed"
            : outcome?.timedOut
              ? "Time expired"
              : "Keep learning"}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-[#15231c]">
          {outcome?.score ?? 0}%
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#637069]">
          {passed
            ? `You passed the ${courseName} assessment. Your verified certificate is ready.`
            : `You need ${outcome?.passingScore || metadata?.passingScore || 70}% to pass. Review the lesson summaries and try again when ready.`}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {passed && outcome?.certificateUrl && (
            <a
              href={outcome.certificateUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
            >
              View certificate
            </a>
          )}
          {!passed && (
            <button
              onClick={() => {
                setStage("intro");
                setAnswers({});
                setCurrent(0);
              }}
              className="rounded-xl bg-[#15231c] px-5 py-3 text-sm font-bold text-white hover:bg-[#176b4d]"
            >
              Review and retry
            </button>
          )}
        </div>
      </section>
    );
  }

  const question = questions[current];
  return (
    <section className="overflow-hidden rounded-3xl border border-[#dfe6e1] bg-white shadow-sm">
      <header className="sticky top-16 z-20 flex items-center gap-4 border-b border-[#dfe6e1] bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-[#176b4d]">
            Final assessment
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#edf2ee]">
            <div
              className="h-full bg-[#26815f] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold tabular-nums ${remaining < 300 ? "bg-rose-50 text-rose-700" : "bg-[#edf2ee] text-[#415048]"}`}
        >
          <ClockIcon className="h-4 w-4" /> {formatRemaining(remaining)}
        </span>
      </header>
      <div className="grid lg:grid-cols-[1fr_240px]">
        <div className="p-6 sm:p-9">
          <p className="text-sm font-bold text-[#95a099]">
            Question {current + 1} of {questions.length}
          </p>
          <h1 className="mt-3 text-xl font-bold leading-8 text-[#15231c] sm:text-2xl">
            {question.prompt}
          </h1>
          <div className="mt-7 space-y-3">
            {question.options.map((option, index) => (
              <label
                key={option}
                className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${answers[question.id] === index ? "border-[#26815f] bg-[#eaf4ee] ring-2 ring-[#e0eee7]" : "border-[#dfe6e1] hover:border-[#c6d1ca] hover:bg-[#f5f8f6]"}`}
              >
                <input
                  type="radio"
                  name={question.id}
                  checked={answers[question.id] === index}
                  onChange={() =>
                    setAnswers((value) => ({ ...value, [question.id]: index }))
                  }
                  className="mt-1 h-4 w-4 accent-[#176b4d]"
                />
                <span className="text-sm font-medium leading-6 text-[#415048]">
                  {option}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-[#edf2ee] pt-5">
            <button
              onClick={() => setCurrent((value) => Math.max(0, value - 1))}
              disabled={current === 0}
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#637069] hover:bg-[#f5f8f6] disabled:invisible"
            >
              Previous
            </button>
            {current < questions.length - 1 ? (
              <button
                onClick={() => setCurrent((value) => value + 1)}
                className="rounded-xl bg-[#15231c] px-5 py-3 text-sm font-bold text-white hover:bg-[#176b4d]"
              >
                Next question
              </button>
            ) : (
              <button
                onClick={submitAssessment}
                disabled={loading}
                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {loading ? "Submitting…" : "Submit assessment"}
              </button>
            )}
          </div>
          {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
        </div>
        <aside className="border-t border-[#dfe6e1] bg-[#f5f8f6] p-5 lg:border-l lg:border-t-0">
          <p className="text-xs font-bold uppercase tracking-wider text-[#748179]">
            Question navigator
          </p>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {questions.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setCurrent(index)}
                aria-label={`Go to question ${index + 1}`}
                className={`grid aspect-square place-items-center rounded-lg text-xs font-bold ${index === current ? "bg-[#15231c] text-white" : answers[item.id] !== undefined ? "bg-emerald-100 text-emerald-700" : "border border-[#dfe6e1] bg-white text-[#748179]"}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-[#748179]">
            {answeredCount} of {questions.length} answered. You can move between
            questions before submitting.
          </p>
        </aside>
      </div>
    </section>
  );
}
