import { describe, it, expect, vi, beforeEach } from "vitest";

const mockState = vi.hoisted(() => ({ isMock: false }));
const { createAdminClientMock } = vi.hoisted(() => ({ createAdminClientMock: vi.fn() }));

vi.mock("@/lib/mock", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/mock")>();
  return {
    ...actual,
    get IS_MOCK() {
      return mockState.isMock;
    },
  };
});
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: createAdminClientMock }));

function makeClient(tableData: Record<string, unknown> = {}) {
  let table = "";
  const result = () => ({ data: tableData[table] ?? null, error: null });
  const builder: Record<string, unknown> = {};
  const chain = () =>
    (..._args: unknown[]) => builder;
  for (const m of ["select", "eq", "order", "limit"]) builder[m] = chain();
  (builder as { then: unknown }).then = (resolve: (v: unknown) => void) => resolve(result());
  const from = vi.fn((t: string) => {
    table = t;
    return builder;
  });
  return { from };
}

beforeEach(() => {
  mockState.isMock = false;
  createAdminClientMock.mockReset();
});

describe("getStudents", () => {
  it("reads the student_summaries view and maps overall_percent → overallPercent", async () => {
    const client = makeClient({
      student_summaries: [
        {
          profile: { id: "s1", name: "Sam", email: "sam@x.com", role: "student" },
          cohort: { id: "c1", name: "Aug", start_date: "2026-08-01" },
          overall_percent: 42,
        },
      ],
    });
    createAdminClientMock.mockReturnValue(client);
    const { getStudents } = await import("@/lib/queries");
    const rows = await getStudents();
    expect(client.from).toHaveBeenCalledWith("student_summaries");
    expect(rows).toEqual([
      {
        profile: { id: "s1", name: "Sam", email: "sam@x.com", role: "student" },
        cohort: { id: "c1", name: "Aug", start_date: "2026-08-01" },
        overallPercent: 42,
      },
    ]);
  });

  it("falls back to mock students without a client in mock mode", async () => {
    mockState.isMock = true;
    const { getStudents } = await import("@/lib/queries");
    const rows = await getStudents();
    expect(createAdminClientMock).not.toHaveBeenCalled();
    expect(rows.length).toBeGreaterThan(0);
  });
});

describe("getDayFunnel", () => {
  it("reads the day_funnel view in real mode", async () => {
    const client = makeClient({
      day_funnel: [
        { day: 1, started: 5, completed: 3 },
        { day: 2, started: 4, completed: 1 },
      ],
    });
    createAdminClientMock.mockReturnValue(client);
    const { getDayFunnel } = await import("@/lib/queries");
    const rows = await getDayFunnel();
    expect(client.from).toHaveBeenCalledWith("day_funnel");
    expect(rows).toEqual([
      { day: 1, started: 5, completed: 3 },
      { day: 2, started: 4, completed: 1 },
    ]);
  });

  it("falls back to mock funnel in mock mode", async () => {
    mockState.isMock = true;
    const { getDayFunnel } = await import("@/lib/queries");
    const rows = await getDayFunnel();
    expect(createAdminClientMock).not.toHaveBeenCalled();
    expect(rows.length).toBe(5);
  });
});
