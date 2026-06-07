import { describe, it, expect, vi, beforeEach } from "vitest";

// Force mock mode
vi.mock("@/lib/mock", () => ({
  IS_MOCK: true,
}));

// Import after mock is set
const { POST } = await import("@/app/api/progress/route");

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/progress", () => {
  it("position 30 / duration 60 → watched_percent 50, completed false", async () => {
    const res = await POST(makeRequest({ lessonId: "lesson-1", positionSeconds: 30, durationSeconds: 60 }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.watched_percent).toBe(50);
    expect(json.completed).toBe(false);
  });

  it("position 55 / duration 60 → watched_percent 92, completed true", async () => {
    const res = await POST(makeRequest({ lessonId: "lesson-1", positionSeconds: 55, durationSeconds: 60 }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.watched_percent).toBe(92);
    expect(json.completed).toBe(true);
  });

  it("invalid body (missing lessonId) → 400", async () => {
    const res = await POST(makeRequest({ positionSeconds: 10, durationSeconds: 60 }));
    expect(res.status).toBe(400);
  });

  it("invalid body (non-number) → 400", async () => {
    const res = await POST(makeRequest({ lessonId: "lesson-1", positionSeconds: "bad", durationSeconds: 60 }));
    expect(res.status).toBe(400);
  });

  it("invalid JSON body → 400", async () => {
    const req = new Request("http://localhost/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
