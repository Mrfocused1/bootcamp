import { describe, it, expect, vi, beforeEach } from "vitest";

const mockState = vi.hoisted(() => ({ isMock: false }));
const { createClientMock } = vi.hoisted(() => ({ createClientMock: vi.fn() }));

vi.mock("@/lib/mock", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/mock")>();
  return {
    ...actual,
    get IS_MOCK() {
      return mockState.isMock;
    },
  };
});
vi.mock("@/lib/supabase/server", () => ({ createClient: createClientMock }));

function makeServerClient(tableData: Record<string, unknown>, user: { id: string } | null = { id: "u1" }) {
  const calls: { table: string; method: string; args: unknown[] }[] = [];
  let table = "";
  const result = () => ({ data: tableData[table] ?? null, error: null });
  const builder: Record<string, unknown> = {};
  const chain = (method: string) =>
    (...args: unknown[]) => {
      calls.push({ table, method, args });
      return builder;
    };
  for (const m of ["select", "eq", "order"]) builder[m] = chain(m);
  (builder as { then: unknown }).then = (resolve: (v: unknown) => void) => resolve(result());
  const from = vi.fn((t: string) => {
    table = t;
    return builder;
  });
  const client = { from, auth: { getUser: vi.fn(async () => ({ data: { user } })) } };
  return { client, calls };
}

beforeEach(() => {
  mockState.isMock = false;
  createClientMock.mockReset();
});

describe("getProgressMap", () => {
  it("reads the lesson_progress table (not the non-existent 'progress')", async () => {
    const { client, calls } = makeServerClient({
      lesson_progress: [
        { lesson_id: "l1", last_position_seconds: 30, watched_percent: 50, completed: false },
      ],
    });
    createClientMock.mockResolvedValue(client);
    const { getProgressMap } = await import("@/lib/queries");
    const map = await getProgressMap();
    expect(client.from).toHaveBeenCalledWith("lesson_progress");
    expect(calls.find((c) => c.table === "progress")).toBeUndefined();
    expect(map.l1.watched_percent).toBe(50);
  });
});

describe("getLessons", () => {
  it("selects only real columns and supplies day_index via the days join", async () => {
    const { client, calls } = makeServerClient({
      lessons: [
        {
          id: "l1",
          day_id: "d1",
          title: "Intro",
          video_provider: "youtube",
          video_id: "abc",
          duration_seconds: 600,
          resources: [],
          chapters: [],
          order: 0,
          days: { day_index: 2 },
        },
      ],
    });
    createClientMock.mockResolvedValue(client);
    const { getLessons } = await import("@/lib/queries");
    const lessons = await getLessons();
    expect(client.from).toHaveBeenCalledWith("lessons");
    const select = calls.find((c) => c.method === "select")?.args[0] as string;
    expect(select).not.toMatch(/\btopics\b/);
    expect(select).toContain("days(day_index)");
    expect(lessons[0].day_index).toBe(2);
    expect(lessons[0].topics).toEqual([]);
    expect(lessons[0].title).toBe("Intro");
  });

  it("tolerates the days join arriving as an array", async () => {
    const { client } = makeServerClient({
      lessons: [
        {
          id: "l1",
          day_id: "d1",
          title: "Intro",
          video_provider: null,
          video_id: null,
          duration_seconds: 0,
          resources: null,
          chapters: null,
          order: 0,
          days: [{ day_index: 3 }],
        },
      ],
    });
    createClientMock.mockResolvedValue(client);
    const { getLessons } = await import("@/lib/queries");
    const lessons = await getLessons();
    expect(lessons[0].day_index).toBe(3);
    expect(lessons[0].chapters).toEqual([]);
    expect(lessons[0].resources).toEqual([]);
  });
});
