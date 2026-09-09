import { date, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const students = mysqlTable("students", {
  id: int("id").autoincrement().primaryKey(),
  nama: varchar("nama", { length: 160 }).notNull(),
  kelas: varchar("kelas", { length: 32 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const parents = mysqlTable("parents", {
  id: int("id").autoincrement().primaryKey(),
  nama: varchar("nama", { length: 160 }).notNull(),
  noHp: varchar("no_hp", { length: 32 }).notNull(),
  studentId: int("student_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const attendanceStatus = mysqlEnum("status", ["Hadir", "Izin", "Alpa", "Telat"]);
export const attendance = mysqlTable("attendance", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  tanggal: date("tanggal").notNull(),
  status: attendanceStatus.notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const verificationStatus = mysqlEnum("status_verifikasi", ["Menunggu", "Disetujui", "Ditolak"]);
export const permissionRequests = mysqlTable("permission_requests", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  tanggal: date("tanggal").notNull(),
  jenis: varchar("jenis", { length: 80 }).notNull(),
  fileVnUrl: text("file_vn_url"),
  fileBuktiUrl: text("file_bukti_url"),
  statusVerifikasi: verificationStatus.default("Menunggu").notNull(),
  catatanGuru: text("catatan_guru"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  verifiedAt: timestamp("verified_at"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Student = typeof students.$inferSelect;
export type Attendance = typeof attendance.$inferSelect;
export type PermissionRequest = typeof permissionRequests.$inferSelect;
