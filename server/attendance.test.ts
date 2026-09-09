import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(user: TrpcContext["user"] = null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("attendance and permissions", () => {
  it("allows public attendance lookup with an ISO date", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.attendance.byDate({ tanggal: "2024-09-10" });
    expect(Array.isArray(result)).toBe(true);
  });

  it("allows public permission queue lookup", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.permissions.list({ status: "Menunggu" });
    expect(Array.isArray(result)).toBe(true);
  });

  it("blocks attendance mutations for unauthenticated users", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.attendance.upsert({
      studentId: 1,
      tanggal: "2024-09-10",
      status: "Hadir",
    })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
