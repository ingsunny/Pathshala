"use client";

import {
  PaperAirplaneIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function TutorChat() {
  const { currentUser } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi — I’m your Northstar tutor. Ask me to explain a concept, create a practice example, or help plan your next study session.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  if (!currentUser) return null;

  async function send(event) {
    event.preventDefault();
    const message = input.trim();
    if (!message || loading) return;
    const next = [...messages, { role: "user", content: message }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const response = await axios.post("/api/tutor", {
        message,
        history: messages.slice(-6),
      });
      setMessages([
        ...next,
        { role: "assistant", content: response.data.reply },
      ]);
    } catch (error) {
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            error.response?.data?.message ||
            "I’m unavailable for a moment. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="northstar-floating-tools fixed bottom-24 right-4 z-[70] sm:bottom-5 sm:right-5">
      {open && (
        <section
          className="mb-3 flex h-[min(620px,72vh)] w-[min(390px,calc(100vw-40px))] flex-col overflow-hidden rounded-3xl border border-[#cbd8d0] bg-white shadow-2xl"
          aria-label="Northstar AI tutor"
        >
          <header className="flex items-center gap-3 bg-[#153e2f] px-5 py-4 text-white">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
              <SparklesIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-sm font-extrabold">Northstar Tutor</h2>
              <p className="text-xs text-[#bcd4c7]">
                Learning help, not test answers
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto rounded-lg p-2 hover:bg-white/10"
              aria-label="Close tutor"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </header>
          <div
            className="flex-1 space-y-3 overflow-y-auto bg-[#f6f8f5] p-4"
            aria-live="polite"
          >
            {messages.map((item, index) => (
              <p
                key={index}
                className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${item.role === "user" ? "ml-auto bg-[#176b4d] text-white" : "border border-[#dfe6e1] bg-white text-[#26362e]"}`}
              >
                {item.content}
              </p>
            ))}
            {loading && (
              <p className="w-fit animate-pulse rounded-2xl bg-white px-4 py-3 text-sm text-[#637069]">
                Thinking…
              </p>
            )}
          </div>
          <form
            onSubmit={send}
            className="flex gap-2 border-t border-[#dfe6e1] bg-white p-3"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={1500}
              placeholder="Ask about what you’re learning…"
              className="northstar-input"
              aria-label="Message Northstar Tutor"
            />
            <button
              disabled={loading || !input.trim()}
              className="grid w-12 shrink-0 place-items-center rounded-xl bg-[#176b4d] text-white disabled:opacity-50"
              aria-label="Send message"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>
        </section>
      )}
      <button
        onClick={() => setOpen((value) => !value)}
        className="ml-auto flex items-center gap-2 rounded-full bg-[#15231c] px-5 py-3.5 text-sm font-extrabold text-white shadow-xl hover:bg-[#176b4d]"
        aria-expanded={open}
      >
        <SparklesIcon className="h-5 w-5" /> Ask tutor
      </button>
    </div>
  );
}
