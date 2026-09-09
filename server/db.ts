import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { attendance, InsertUser, permissionRequests, students, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  const url = process.env.DATABASE_URL ?? process.env.MYSQL_URL;
  if (!_db && url) {
    try { _db = drizzle(url); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  values.lastSignedIn ??= new Date();
  if (!Object.keys(updateSet).length) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listStudents() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(students).orderBy(students.nama);
}

export async function listAttendanceByDate(tanggal: string) {
  const db = await getDb(); if (!db) return [];
  return db.select().from(attendance).where(eq(attendance.tanggal, new Date(`${tanggal}T00:00:00.000Z`)));
}

export async function saveAttendance(input: { studentId: number; tanggal: string; status: "Hadir" | "Izin" | "Alpa" | "Telat" }) {
  const db = await getDb(); if (!db) return null;
  const tanggal = new Date(`${input.tanggal}T00:00:00.000Z`);
  const existing = await db.select().from(attendance).where(and(eq(attendance.studentId, input.studentId), eq(attendance.tanggal, tanggal))).limit(1);
  if (existing[0]) {
    await db.update(attendance).set({ status: input.status }).where(eq(attendance.id, existing[0].id));
    return { ...existing[0], status: input.status };
  }
  const inserted = await db.insert(attendance).values({ ...input, tanggal });
  return { id: inserted[0].insertId, ...input };
}

export async function listPermissionRequests(status?: "Menunggu" | "Disetujui" | "Ditolak") {
  const db = await getDb(); if (!db) return [];
  return db.select().from(permissionRequests).where(status ? eq(permissionRequests.statusVerifikasi, status) : undefined).orderBy(sql`${permissionRequests.createdAt} desc`);
}

export async function createPermissionRequest(input: { studentId: number; tanggal: string; jenis: string; fileVnUrl?: string; fileBuktiUrl?: string }) {
  const db = await getDb(); if (!db) return null;
  const tanggal = new Date(`${input.tanggal}T00:00:00.000Z`);
  const inserted = await db.insert(permissionRequests).values({ ...input, tanggal, statusVerifikasi: "Menunggu" });
  return { id: inserted[0].insertId, ...input, statusVerifikasi: "Menunggu" as const };
}

export async function verifyPermissionRequest(input: { id: number; statusVerifikasi: "Disetujui" | "Ditolak"; catatanGuru?: string }) {
  const db = await getDb(); if (!db) return null;
  const { id, ...update } = input;
  await db.update(permissionRequests).set({ ...update, verifiedAt: new Date() }).where(eq(permissionRequests.id, id));
  return db.select().from(permissionRequests).where(eq(permissionRequests.id, id)).limit(1).then((rows) => rows[0]);
}

export async function attendanceSummary(tanggalMulai: string, tanggalSelesai: string) {
  const db = await getDb(); if (!db) return [];
  return db.select({ status: attendance.status, jumlah: sql<number>`count(*)` }).from(attendance).where(sql`${attendance.tanggal} between ${tanggalMulai} and ${tanggalSelesai}`).groupBy(attendance.status);
}
