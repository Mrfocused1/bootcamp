import { describe, it, expect, vi } from "vitest";

// Force mock mode
vi.mock("@/lib/mock", async () => {
  const actual = await vi.importActual<typeof import("@/lib/mock")>("@/lib/mock");
  return { ...actual, IS_MOCK: true };
});

const { POST } = await import("@/app/api/ai/route");

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/ai", () => {
  it("returns a non-empty reply in mock mode", async () => {
    const res = await POST(makeRequest({ lessonId: "lesson-1", message: "What is Cursor?" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(typeof json.reply).toBe("string");
    expect(json.reply.length).toBeGreaterThan(0);
  });

  it("reply references the lesson topic when lessonId is provided", async () => {
    const res = await POST(makeRequest({ lessonId: "lesson-1", message: "Tell me more" }));
    const json = await res.json();
    // lesson-1 topic is "Cursor"
    expect(json.reply).toContain("Cursor");
  });

  it("empty message → 400", async () => {
    const res = await POST(makeRequest({ lessonId: null, message: "" }));
    expect(res.status).toBe(400);
  });

  it("missing message → 400", async () => {
    const res = await POST(makeRequest({ lessonId: null }));
    expect(res.status).toBe(400);
  });

  it("invalid JSON → 400", async () => {
    const req = new Request("http://localhost/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
