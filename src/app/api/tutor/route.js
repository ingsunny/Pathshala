import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";

const fallbackReplies = [
  "Start by explaining the idea in your own words, then compare it with the lesson summary. The gap between the two is what to review next.",
  "Break this into three parts: what the concept does, why it matters, and one example you could build. That usually makes the next step much clearer.",
  "Try a tiny practice example first. Change one input, predict the result, and then check your prediction. Active recall beats rereading.",
];

export async function POST(request) {
  try {
    const session = readSession(request);
    if (!session?.sub) {
      return NextResponse.json(
        { message: "Sign in to use the Northstar tutor" },
        { status: 401 },
      );
    }

    const { message, context = "", history = [] } = await request.json();
    const cleanMessage = String(message || "")
      .trim()
      .slice(0, 1500);
    if (!cleanMessage) {
      return NextResponse.json(
        { message: "Ask a learning question" },
        { status: 400 },
      );
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      const index = cleanMessage.length % fallbackReplies.length;
      return NextResponse.json({
        reply: `${fallbackReplies[index]}${context ? `\n\nFor your current lesson (${String(context).slice(0, 120)}), focus on the key terms and apply each one in a concrete example.` : ""}`,
        configured: false,
      });
    }

    const messages = [
      {
        role: "system",
        content:
          "You are Northstar Tutor, a concise and encouraging learning coach. Teach through explanation and hints. Do not provide answers to active assessments. If the user asks for an exam answer, refuse briefly and explain the underlying concept instead.",
      },
      ...(context
        ? [
            {
              role: "system",
              content: `Current learning context: ${String(context).slice(0, 1000)}`,
            },
          ]
        : []),
      ...history.slice(-6).map((item) => ({
        role: item.role === "assistant" ? "assistant" : "user",
        content: String(item.content || "").slice(0, 1200),
      })),
      { role: "user", content: cleanMessage },
    ];

    const response = await fetch(
      process.env.DEEPSEEK_API_URL ||
        "https://api.deepseek.com/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
          messages,
          temperature: 0.35,
          max_tokens: 500,
        }),
      },
    );
    if (!response.ok) throw new Error(`DeepSeek returned ${response.status}`);
    const data = await response.json();
    return NextResponse.json({
      reply:
        data.choices?.[0]?.message?.content ||
        "I could not form a response. Try rephrasing the question.",
      configured: true,
    });
  } catch (error) {
    console.error("Tutor request failed", error);
    return NextResponse.json(
      { message: "The tutor is temporarily unavailable" },
      { status: 502 },
    );
  }
}
