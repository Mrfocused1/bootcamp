import { describe, it, expect, vi, beforeEach } from "vitest";

// Toggle IS_MOCK per-test via a hoisted getter (same pattern as the admin
// actions.realmode.test.ts). The route reads IS_MOCK at request time.
const mockState = vi.hoisted(() => ({ isMock: false }));
const { createClientMock } = vi.hoisted(() => ({ createClientMock: vi.fn() }));

vi.mock("@/lib/mock", () => ({
  get IS_MOCK() {
    return mockState.isMock;
  },
}));
vi.mock("@/lib/supabase/server", () => ({ createClient: createClientMock }));

// Chainable Supabase mock. Records every call; the enrollment lookup chain
// resolves via maybeSingle(), and `from("bookings").upsert(...)` returns
// { error }. `userData` configures auth.getUser().
function makeClient(opts: {
  user?: { id: string } | null;
  enrollment?: { cohort_id: string | null } | null;
  upsertError?: { message: string } | null;
} = {}) {
  const calls: { table: string; method: string; args: unknown[] }[] = [];
  let table = "";
  const builder: Record<string, unknown> = {};
  const chain = (method: string) =>
    (...args: unknown[]) => {
      calls.push({ table, method, args });
      return builder;
    };
  for (const m of ["select", "eq", "order", "limit", "upsert"]) {
    builder[m] = chain(m);
  }
  builder.maybeSingle = () =>
    Promise.resolve({ data: opts.enrollment ?? null, error: null });
  // upsert is awaited directly (no maybeSingle), so the builder is thenable
  // and resolves to the upsert result.
  (builder as { then: unknown }).then = (resolve: (v: unknown) => void) =>
    resolve({ error: opts.upsertError ?? null });

  const from = vi.fn((t: string) => {
    table = t;
    return builder;
  });
  const getUser = vi.fn(() =>
    Promise.resolve({ data: { user: opts.user ?? null }, error: null }),
  );
  return { client: { from, auth: { getUser } }, calls };
}

async function route() {
  return import("@/app/api/book/route");
}

function post(body: unknown, raw = false): Request {
  return new Request("http://localhost/api/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: raw ? (body as string) : JSON.stringify(body),
  });
}

beforeEach(() => {
  mockState.isMock = false;
  createClientMock.mockReset();
});

describe("POST /api/book", () => {
  it("returns 400 for an invalid body (bad date / time format)", async () => {
    const { POST } = await route();
    const res = await POST(post({ start_date: "06/01/2026", daily_time: "9am" }));
    expect(res.status).toBe(400);
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON", async () => {
    const { POST } = await route();
    const res = await POST(post("{not json", true));
    expect(res.status).toBe(400);
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("returns { ok:true, mocked:true } in mock mode without constructing a client", async () => {
    mockState.isMock = true;
    const { POST } = await route();
    const res = await POST(post({ start_date: "2026-06-20", daily_time: "09:00" }));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true, mocked: true });
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("returns 401 in real mode when unauthenticated", async () => {
    const { client } = makeClient({ user: null });
    createClientMock.mockResolvedValue(client);
    const { POST } = await route();
    const res = await POST(post({ start_date: "2026-06-20", daily_time: "09:00" }));
    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toMatchObject({ ok: false });
  });

  it("upserts into bookings with the right payload and returns { ok:true }", async () => {
    const { client, calls } = makeClient({
      user: { id: "student-1" },
      enrollment: { cohort_id: "cohort-1" },
    });
    createClientMock.mockResolvedValue(client);
    const { POST } = await route();
    const res = await POST(post({ start_date: "2026-06-20", daily_time: "17:00" }));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });

    expect(client.from).toHaveBeenCalledWith("bookings");
    const upsert = calls.find((c) => c.method === "upsert");
    expect(upsert?.table).toBe("bookings");
    expect(upsert?.args[0]).toMatchObject({
      user_id: "student-1",
      cohort_id: "cohort-1",
      start_date: "2026-06-20",
      daily_time: "17:00",
    });
    // onConflict on user_id (one booking per student)
    expect(upsert?.args[1]).toEqual({ onConflict: "user_id" });
  });

  it("upserts cohort_id:null when the student has no active enrollment", async () => {
    const { client, calls } = makeClient({
      user: { id: "student-2" },
      enrollment: null,
    });
    createClientMock.mockResolvedValue(client);
    const { POST } = await route();
    const res = await POST(post({ start_date: "2026-07-01", daily_time: "19:30" }));
    expect(res.status).toBe(200);
    const upsert = calls.find((c) => c.method === "upsert");
    expect((upsert?.args[0] as { cohort_id: unknown }).cohort_id).toBeNull();
  });

  it("returns 500 when the upsert errors", async () => {
    const { client } = makeClient({
      user: { id: "student-1" },
      enrollment: { cohort_id: "cohort-1" },
      upsertError: { message: "boom" },
    });
    createClientMock.mockResolvedValue(client);
    const { POST } = await route();
    const res = await POST(post({ start_date: "2026-06-20", daily_time: "09:00" }));
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toMatchObject({ ok: false, error: "boom" });
  });
});
