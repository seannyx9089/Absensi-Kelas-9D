import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createPermissionRequest, listAttendanceByDate, listPermissionRequests, listStudents, saveAttendance, attendanceSummary, verifyPermissionRequest } from "./db";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

const dateInput = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal harus berformat YYYY-MM-DD");
const statusInput = z.enum(["Hadir", "Izin", "Alpa", "Telat"]);
const teacherProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Akses khusus guru." });
  return next();
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  students: router({ list: publicProcedure.query(() => listStudents()) }),
  attendance: router({
    byDate: publicProcedure.input(z.object({ tanggal: dateInput })).query(({ input }) => listAttendanceByDate(input.tanggal)),
    upsert: teacherProcedure.input(z.object({ studentId: z.number().int().positive(), tanggal: dateInput, status: statusInput })).mutation(({ input }) => saveAttendance(input)),
    weeklySummary: publicProcedure.input(z.object({ mulai: dateInput, selesai: dateInput })).query(({ input }) => attendanceSummary(input.mulai, input.selesai)),
    markMissingAsAlpa: teacherProcedure.input(z.object({ tanggal: dateInput, batasWaktu: z.string().default("08:00") })).mutation(async ({ input }) => {
      const now = new Date();
      const [hour, minute] = input.batasWaktu.split(":").map(Number);
      if (now.getHours() < hour || (now.getHours() === hour && now.getMinutes() < minute)) return { marked: 0, skipped: true };
      const [roster, existing] = await Promise.all([listStudents(), listAttendanceByDate(input.tanggal)]);
      const present = new Set(existing.map((row) => row.studentId));
      let marked = 0;
      for (const student of roster) { if (!present.has(student.id)) { await saveAttendance({ studentId: student.id, tanggal: input.tanggal, status: "Alpa" }); marked += 1; } }
      return { marked, skipped: false };
    }),
  }),
  permissions: router({
    list: publicProcedure.input(z.object({ status: z.enum(["Menunggu", "Disetujui", "Ditolak"]).optional() }).optional()).query(({ input }) => listPermissionRequests(input?.status)),
    create: publicProcedure.input(z.object({ studentId: z.number().int().positive(), tanggal: dateInput, jenis: z.string().min(2), fileVnUrl: z.string().url().optional(), fileBuktiUrl: z.string().url().optional() })).mutation(({ input }) => createPermissionRequest(input)),
    verify: teacherProcedure.input(z.object({ id: z.number().int().positive(), statusVerifikasi: z.enum(["Disetujui", "Ditolak"]), catatanGuru: z.string().max(500).optional() })).mutation(({ input }) => verifyPermissionRequest(input)),
  }),
});

export type AppRouter = typeof appRouter;
