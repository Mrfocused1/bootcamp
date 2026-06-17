import { describe, it, expect, vi, beforeEach } from "vitest";

// Real-mode counterpart to actions.test.ts (which forces IS_MOCK:true).
// Here IS_MOCK defaults to false so we can assert the actual Supabase writes.
const mockState = vi.hoisted(() => ({ isMock: false }));
const { sendEmailMock, getCurrentProfileMock, createAdminClientMock } = vi.hoisted(() => ({
  sendEmailMock: vi.fn(),
  getCurrentProfileMock: vi.fn(),
  createAdminClientMock: vi.fn(),
}));

vi.mock("@/lib/mock", () => ({
  get IS_MOCK() {
    return mockState.isMock;
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/queries", () => ({ getCurrentProfile: getCurrentProfileMock }));
vi.mock("@/lib/email", () => ({ sendEmail: sendEmailMock }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: createAdminClientMock }));

// Chainable Supabase mock. Records every call; awaiting any chain (or
// maybeSingle/single) resolves to the data configured for the current table.
function makeClient(tableData: Record<string, unknown> = {}) {
  const calls: { table: string; method: string; args: unknown[] }[] = [];
  let table = "";
  const result = () => ({ data: tableData[table] ?? null, error: null });
  const builder: Record<string, unknown> = {};
  const chain = (method: string) =>
    (...args: unknown[]) => {
      calls.push({ table, method, args });
      return builder;
    };
  for (const m of ["update", "insert", "eq", "select", "order", "limit"]) {
    builder[m] = chain(m);
  }
  builder.maybeSingle = () => Promise.resolve(result());
  builder.single = () => Promise.resolve(result());
  (builder as { then: unknown }).then = (resolve: (v: unknown) => void) => resolve(result());
  const from = vi.fn((t: string) => {
    table = t;
    return builder;
  });
  return { client: { from }, calls };
}

const ADMIN = { id: "admin-1", name: "Admin", email: "a@x.com", role: "admin" as const };

async function actions() {
  return import("@/app/(app)/admin/actions");
}

beforeEach(() => {
  mockState.isMock = false;
  sendEmailMock.mockReset().mockResolvedValue({ ok: true, id: "e1" });
  getCurrentProfileMock.mockReset().mockResolvedValue(ADMIN);
  createAdminClientMock.mockReset();
});

describe("saveLesson (real mode)", () => {
  it("updates the lesson by id", async () => {
    const { client, calls } = makeClient();
    createAdminClientMock.mockReturnValue(client);
    const fd = new FormData();
    fd.set("id", "lesson-1");
    fd.set("title", "New title");
    fd.set("video_provider", "youtube");
    fd.set("video_id", "abc123");
    const { saveLesson } = await actions();
    await saveLesson(fd);
    expect(client.from).toHaveBeenCalledWith("lessons");
    expect(calls.find((c) => c.method === "update")?.args[0]).toEqual({
      title: "New title",
      video_provider: "youtube",
      video_id: "abc123",
    });
    expect(calls.find((c) => c.method === "eq")?.args).toEqual(["id", "lesson-1"]);
  });

  it("no-ops without touching Supabase in mock mode", async () => {
    mockState.isMock = true;
    const fd = new FormData();
    fd.set("id", "lesson-1");
    const { saveLesson } = await actions();
    await saveLesson(fd);
    expect(createAdminClientMock).not.toHaveBeenCalled();
  });

  it("skips the write when id is missing", async () => {
    const { client } = makeClient();
    createAdminClientMock.mockReturnValue(client);
    const { saveLesson } = await actions();
    await saveLesson(new FormData());
    expect(client.from).not.toHaveBeenCalled();
  });
});

describe("setAccess (real mode)", () => {
  it("updates enrollments.status filtered by user_id", async () => {
    const { client, calls } = makeClient();
    createAdminClientMock.mockReturnValue(client);
    const { setAccess } = await actions();
    await setAccess("student-9", "revoked");
    expect(client.from).toHaveBeenCalledWith("enrollments");
    expect(calls.find((c) => c.method === "update")?.args[0]).toEqual({ status: "revoked" });
    expect(calls.find((c) => c.method === "eq")?.args).toEqual(["user_id", "student-9"]);
  });
});

describe("saveCohort (real mode)", () => {
  it("inserts name + start_date", async () => {
    const { client, calls } = makeClient();
    createAdminClientMock.mockReturnValue(client);
    const fd = new FormData();
    fd.set("name", "August 2026");
    fd.set("start_date", "2026-08-01");
    const { saveCohort } = await actions();
    await saveCohort(fd);
    expect(client.from).toHaveBeenCalledWith("cohorts");
    expect(calls.find((c) => c.method === "insert")?.args[0]).toEqual({
      name: "August 2026",
      start_date: "2026-08-01",
    });
  });
});

describe("saveLiveSession (real mode)", () => {
  it("attaches to the latest cohort and inserts the session", async () => {
    const { client, calls } = makeClient({ cohorts: { id: "cohort-x" } });
    createAdminClientMock.mockReturnValue(client);
    const fd = new FormData();
    fd.set("day_index", "4");
    fd.set("scheduled_at", "2026-08-05T18:00");
    fd.set("zoom_url", "https://zoom.us/j/123");
    const { saveLiveSession } = await actions();
    await saveLiveSession(fd);
    expect(client.from).toHaveBeenCalledWith("live_sessions");
    const insert = calls.find((c) => c.method === "insert")?.args[0] as Record<string, unknown>;
    expect(insert.cohort_id).toBe("cohort-x");
    expect(insert.day_index).toBe(4);
    expect(insert.zoom_url).toBe("https://zoom.us/j/123");
    expect(typeof insert.scheduled_at).toBe("string");
  });

  it("does not insert when no cohort exists yet", async () => {
    const { client, calls } = makeClient({ cohorts: null });
    createAdminClientMock.mockReturnValue(client);
    const { saveLiveSession } = await actions();
    await saveLiveSession(new FormData());
    expect(calls.some((c) => c.method === "insert")).toBe(false);
  });
});

describe("postAnnouncement (real mode)", () => {
  it("inserts title + body", async () => {
    const { client, calls } = makeClient();
    createAdminClientMock.mockReturnValue(client);
    const fd = new FormData();
    fd.set("title", "Welcome!");
    fd.set("body", "We start Monday.");
    const { postAnnouncement } = await actions();
    await postAnnouncement(fd);
    expect(client.from).toHaveBeenCalledWith("announcements");
    expect(calls.find((c) => c.method === "insert")?.args[0]).toEqual({
      title: "Welcome!",
      body: "We start Monday.",
    });
  });
});

describe("nudgeStudent (real mode)", () => {
  it("emails the student's fetched address", async () => {
    const { client } = makeClient({ profiles: { name: "Sam", email: "sam@x.com" } });
    createAdminClientMock.mockReturnValue(client);
    const { nudgeStudent } = await actions();
    const res = await nudgeStudent("student-2");
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    expect(sendEmailMock.mock.calls[0][0].to).toBe("sam@x.com");
    expect(res).toEqual({ ok: true });
  });

  it("returns ok:false and sends nothing when the profile has no email", async () => {
    const { client } = makeClient({ profiles: { name: "Sam", email: null } });
    createAdminClientMock.mockReturnValue(client);
    const { nudgeStudent } = await actions();
    const res = await nudgeStudent("student-2");
    expect(sendEmailMock).not.toHaveBeenCalled();
    expect(res).toEqual({ ok: false });
  });
});

describe("sendBroadcast (real mode)", () => {
  it("emails active enrollees and returns the recipient count", async () => {
    const { client, calls } = makeClient({
      enrollments: [
        { profiles: { email: "a@x.com" } },
        { profiles: { email: "b@x.com" } },
        { profiles: { email: null } },
      ],
    });
    createAdminClientMock.mockReturnValue(client);
    const fd = new FormData();
    fd.set("recipient_type", "all");
    fd.set("subject", "Hi");
    fd.set("body", "Body");
    const { sendBroadcast } = await actions();
    const res = await sendBroadcast(fd);
    expect(client.from).toHaveBeenCalledWith("enrollments");
    expect(sendEmailMock).toHaveBeenCalledTimes(2);
    expect(res).toEqual({ ok: true, recipients: 2 });
    expect(calls.find((c) => c.method === "eq" && c.args[0] === "cohort_id")).toBeUndefined();
  });

  it("filters by cohort when recipient_type is cohort", async () => {
    const { client, calls } = makeClient({ enrollments: [{ profiles: { email: "a@x.com" } }] });
    createAdminClientMock.mockReturnValue(client);
    const fd = new FormData();
    fd.set("recipient_type", "cohort");
    fd.set("cohort", "cohort-7");
    fd.set("subject", "Hi");
    fd.set("body", "Body");
    const { sendBroadcast } = await actions();
    await sendBroadcast(fd);
    expect(calls.find((c) => c.method === "eq" && c.args[0] === "cohort_id")?.args).toEqual([
      "cohort_id",
      "cohort-7",
    ]);
  });

  it("refuses (sends nothing) when 'cohort' is chosen but none selected", async () => {
    const { client } = makeClient({ enrollments: [{ profiles: { email: "a@x.com" } }] });
    createAdminClientMock.mockReturnValue(client);
    const fd = new FormData();
    fd.set("recipient_type", "cohort"); // no "cohort" value chosen
    fd.set("subject", "Hi");
    fd.set("body", "Body");
    const { sendBroadcast } = await actions();
    const res = await sendBroadcast(fd);
    expect(res).toEqual({ ok: false, recipients: 0 });
    expect(sendEmailMock).not.toHaveBeenCalled();
  });
});
