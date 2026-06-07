"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AiAssistantProps {
  lessonId: string | null;
}

export function AiAssistant({ lessonId }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = input.trim();
    if (!message || loading) return;

    const userMsg: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, message }),
      });
      const data = await res.json();
      const reply = data.reply ?? "Sorry, something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Unable to reach the AI assistant. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{ backgroundColor: "#fff", minHeight: "320px", maxHeight: "480px" }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 border-b border-black/10"
      >
        <h3
          className="font-semibold text-sm"
          style={{
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            color: "var(--ua-ink)",
          }}
        >
          Ask the AI assistant
        </h3>
      </div>

      {/* Thread */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.4 }}>
            Ask anything about this lesson — the AI assistant is here to help.
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
              style={
                msg.role === "user"
                  ? { backgroundColor: "var(--ua-blue)", color: "#fff" }
                  : { backgroundColor: "var(--ua-bg)", color: "var(--ua-ink)" }
              }
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl px-4 py-2.5 text-sm"
              style={{ backgroundColor: "var(--ua-bg)", color: "var(--ua-ink)", opacity: 0.5 }}
            >
              Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="px-4 py-3 border-t border-black/10 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          disabled={loading}
          className="flex-1 rounded-full border px-4 py-2 text-sm outline-none focus:ring-2 disabled:opacity-50"
          style={{
            borderColor: "rgba(20,20,20,0.15)",
            color: "var(--ua-ink)",
            backgroundColor: "var(--ua-bg)",
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
          style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
