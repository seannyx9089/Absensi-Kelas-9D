import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight, BarChart3, Bell, CalendarDays, Check, CheckCircle2, ChevronDown,
  CircleHelp, Clock3, Download, FileText, Headphones, LayoutDashboard, Menu,
  Mic, Paperclip, Play, Plus, Radio, ShieldCheck, Sparkles, Users, X, XCircle,
} from "lucide-react";

type Mode = "home" | "teacher" | "parent";
type AttendanceStatus = "Belum ditandai" | "Hadir" | "Izin" | "Alpa" | "Telat";

type Student = { id: number; initials: string; name: string; className: string; status: AttendanceStatus; note: string };
type PermissionRequest = { id: string; student: string; kind: string; voiceUrl: string; evidenceUrl: string; evidenceName: string; createdAt: string; status: "Menunggu verifikasi" | "Disetujui" | "Ditolak" };

const PERMISSION_REQUESTS_KEY = "ruang-hadir-permission-requests";
const TEACHER_SESSION_KEY = "ruang-hadir-teacher-session";

const studentNames: string[] = [
  "Ahmad Faisal Rizki",
  "Aisha Shakira Gustiar",
  "Akmal Agung Asyhari",
  "Ayesha Anervian",
  "Desvita Indriyani",
  "Dewi Novianti",
  "Eliza Eliana",
  "Eneng Sadira Aulia",
  "Ilham Maulana",
  "Irma Agustina",
  "Laila Shafira Zahra",
  "M Daffa Al-Goffar",
  "M. Aldan Febrian",
  "M. Marlian Maulana",
  "M. Tegar Ramadhan",
  "Moch. Jildan Apriliandi",
  "Muhamad Abibi Arahman",
  "Muhamad Sidik",
  "Muhamad Syaripatul Akbar",
  "Muhammad Haikal Aditya",
  "Muhammad Ilyas",
  "Muhammad Reza Setiawan",
  "Nabil Saepul Anwar",
  "Nadira Raeesa Mahadillan",
  "Rahmi Ulfa Munawaroh",
  "Ramdani",
  "Randiansa Saputra",
  "Rifda Nurfadilah",
  "Rizki Aprilliyo",
  "Rizky Anugrahwan",
  "Silvi Aulia",
  "Siti Hardiyanti",
  "Siti Juliani",
  "Siti Maulida",
  "Siti Sarah Rahmawati",
  "Siti Zulfah Zakiah",
  "Siva Sri Rahayu",
  "Tira Aprilia",
  "Yasmin Syafka Galbina",
];

const studentsSeed: Student[] = [
  { id: 1, initials: "AF", name: "Ahmad Faisal Rizki", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 2, initials: "AS", name: "Aisha Shakira Gustiar", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 3, initials: "AA", name: "Akmal Agung Asyhari", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 4, initials: "AA", name: "Ayesha Anervian", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 5, initials: "DI", name: "Desvita Indriyani", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 6, initials: "DN", name: "Dewi Novianti", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 7, initials: "EE", name: "Eliza Eliana", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 8, initials: "ES", name: "Eneng Sadira Aulia", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 9, initials: "IM", name: "Ilham Maulana", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 10, initials: "IA", name: "Irma Agustina", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 11, initials: "LS", name: "Laila Shafira Zahra", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 12, initials: "MD", name: "M Daffa Al-Goffar", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 13, initials: "MA", name: "M. Aldan Febrian", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 14, initials: "MM", name: "M. Marlian Maulana", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 15, initials: "MT", name: "M. Tegar Ramadhan", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 16, initials: "MJ", name: "Moch. Jildan Apriliandi", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 17, initials: "MA", name: "Muhamad Abibi Arahman", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 18, initials: "MS", name: "Muhamad Sidik", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 19, initials: "MS", name: "Muhamad Syaripatul Akbar", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 20, initials: "MH", name: "Muhammad Haikal Aditya", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 21, initials: "MI", name: "Muhammad Ilyas", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 22, initials: "MR", name: "Muhammad Reza Setiawan", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 23, initials: "NS", name: "Nabil Saepul Anwar", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 24, initials: "NR", name: "Nadira Raeesa Mahadillan", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 25, initials: "RU", name: "Rahmi Ulfa Munawaroh", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 26, initials: "R", name: "Ramdani", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 27, initials: "RS", name: "Randiansa Saputra", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 28, initials: "RN", name: "Rifda Nurfadilah", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 29, initials: "RA", name: "Rizki Aprilliyo", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 30, initials: "RA", name: "Rizky Anugrahwan", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 31, initials: "SA", name: "Silvi Aulia", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 32, initials: "SH", name: "Siti Hardiyanti", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 33, initials: "SJ", name: "Siti Juliani", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 34, initials: "SM", name: "Siti Maulida", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 35, initials: "SS", name: "Siti Sarah Rahmawati", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 36, initials: "SZ", name: "Siti Zulfah Zakiah", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 37, initials: "SS", name: "Siva Sri Rahayu", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 38, initials: "TA", name: "Tira Aprilia", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
  { id: 39, initials: "YS", name: "Yasmin Syafka Galbina", className: "IX D", status: "Belum ditandai", note: "Menunggu absensi guru" },
];

const statusStyle: Record<AttendanceStatus, { dot: string; bg: string; text: string }> = {
  "Belum ditandai": { dot: "#9aa5ad", bg: "#eef1f3", text: "#66727c" },
  Hadir: { dot: "#1f8f64", bg: "#e2f3eb", text: "#176746" },
  Izin: { dot: "#c98b21", bg: "#fbefd8", text: "#996715" },
  Alpa: { dot: "#c84d4d", bg: "#f9e1df", text: "#a33f3f" },
  Telat: { dot: "#74808b", bg: "#e9edf0", text: "#5d6973" },
};

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${compact ? "scale-90 origin-left" : ""}`}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg shadow-[#0A2540]/15 ring-1 ring-[#0A2540]/10">
        <img src="/logo-kelas-ixd.png" alt="Logo Kelas IX D" className="h-full w-full object-cover" />
      </div>
      <div>
        <div className="font-display text-[15px] font-extrabold tracking-tight text-[#0A2540]">Ruang Hadir</div>
        <div className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#74808b]">IX D · SMP PGRI 1 CIDAHU</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: AttendanceStatus }) {
  const style = statusStyle[status];
  return <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold" style={{ background: style.bg, color: style.text }}><span className="h-1.5 w-1.5 rounded-full" style={{ background: style.dot }} />{status}</span>;
}

function SectionLabel({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <div className="mb-7"><div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.18em] text-[#1f8f64]"><span className="h-1.5 w-1.5 rounded-full bg-[#1f8f64]" />{eyebrow}</div><h2 className="font-display text-3xl font-extrabold tracking-[-.04em] text-[#0A2540] sm:text-4xl">{title}</h2>{copy && <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#667788]">{copy}</p>}</div>;
}

function isAttendanceWindow() {
  const hour = Number(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jakarta", hour: "2-digit", hour12: false }).format(new Date()));
  return hour >= 4 && hour < 8;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result ?? "")); reader.onerror = reject; reader.readAsDataURL(file); });
}

function Home({ teacherOnly = false, evidenceOnly = false }: { teacherOnly?: boolean; evidenceOnly?: boolean }) {
  const [mode, setMode] = useState<Mode>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [students, setStudents] = useState(studentsSeed);
  const [notice, setNotice] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [teacherFilter, setTeacherFilter] = useState<"all" | "review">("all");
  const [proofPreview, setProofPreview] = useState<"vn" | "file" | null>(null);
  const [permissionRequests, setPermissionRequests] = useState<PermissionRequest[]>(() => { try { return JSON.parse(window.localStorage.getItem(PERMISSION_REQUESTS_KEY) ?? "[]"); } catch { return []; } });

  useEffect(() => {
    const remembered = window.localStorage.getItem(TEACHER_SESSION_KEY) === "1";
    if (remembered) {
      setLoggedIn(true);
      if (teacherOnly) {
        setMode("teacher");
        window.setTimeout(() => document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" }), 50);
      }
    } else if (teacherOnly || evidenceOnly) {
      setShowLogin(true);
    }
  }, [teacherOnly, evidenceOnly]);

  useEffect(() => {
    const syncSchedule = () => setAttendanceOpen(isAttendanceWindow());
    syncSchedule();
    const timer = window.setInterval(syncSchedule, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const jump = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMobileOpen(false); };
  const openMode = (next: Mode) => { if (next === "teacher" && !loggedIn) { setShowLogin(true); return; } setMode(next); setNotice(""); window.setTimeout(() => document.getElementById(next === "teacher" ? "dashboard" : "izin")?.scrollIntoView({ behavior: "smooth" }), 20); };
  const updateStatus = (id: number, status: AttendanceStatus) => {
    if (!attendanceOpen) { setNotice("Buka absensi terlebih dahulu untuk mengubah status."); return; }
    setStudents((current) => current.map((student) => student.id === id ? { ...student, status, note: status === "Hadir" ? "Terlihat oleh orang tua: Hadir" : status === "Izin" ? "Menunggu verifikasi orang tua" : status === "Alpa" ? "Terlihat oleh orang tua: Alpa" : "Terlihat oleh orang tua: Telat" } : student));
    setNotice(`Status ${status.toLowerCase()} tersimpan dan terlihat oleh orang tua.`);
  };
  const visibleStudents = teacherFilter === "review" ? students.filter((student) => student.status === "Izin") : students;
  const reviewCount = students.filter((student) => student.status === "Izin").length;
  const handlePermissionSent = (request: PermissionRequest) => { setPermissionRequests((current) => { const next = [request, ...current]; window.localStorage.setItem(PERMISSION_REQUESTS_KEY, JSON.stringify(next)); return next; }); setNotice("Izin dan bukti berhasil dikirim. Guru dapat memeriksanya di halaman Bukti Izin."); };
  const updatePermissionStatus = (id: string, status: PermissionRequest["status"]) => { setPermissionRequests((current) => { const next = current.map((request) => request.id === id ? { ...request, status } : request); window.localStorage.setItem(PERMISSION_REQUESTS_KEY, JSON.stringify(next)); return next; }); setNotice(`Pengajuan izin ${status.toLowerCase()} dan statusnya diperbarui.`); };
  const toggleAttendance = () => { if (!isAttendanceWindow()) { setNotice("Absensi otomatis hanya aktif pukul 04.00–08.00 WIB. Pengiriman izin tetap terbuka di luar jam tersebut."); return; } setAttendanceOpen((open) => !open); setNotice(attendanceOpen ? "Sesi absensi ditutup oleh guru." : "Sesi absensi dibuka."); };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F0E6] text-[#243447]">
      <header className="sticky top-0 z-30 border-b border-[#0A2540]/8 bg-[#F5F0E6]/90 backdrop-blur-xl">
        <div className="section-shell flex h-[76px] items-center justify-between">
          <Link href="/"><Logo /></Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#667788] md:flex">
            <button onClick={() => jump("beranda")} className="transition-colors hover:text-[#0A2540]">Beranda</button>
            <button onClick={() => openMode("teacher")} className="transition-colors hover:text-[#0A2540]">Absensi</button>
            <button onClick={() => jump("rekap")} className="transition-colors hover:text-[#0A2540]">Rekap</button>
            <button onClick={() => jump("kontak")} className="transition-colors hover:text-[#0A2540]">Kontak</button>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <button onClick={() => openMode("parent")} className="rounded-full px-4 py-2 text-sm font-bold text-[#0A2540] transition hover:bg-white">Kirim izin</button>
            <button onClick={() => openMode("teacher")} className="rounded-full bg-[#0A2540] px-5 py-2.5 text-sm font-bold text-[#F5F0E6] shadow-lg shadow-[#0A2540]/15 transition hover:bg-[#143b5d]">Masuk sebagai guru <ArrowRight className="ml-1 inline-block h-4 w-4" /></button>
          </div>
          <button aria-label="Buka menu" onClick={() => setMobileOpen(!mobileOpen)} className="rounded-xl p-2 text-[#0A2540] md:hidden"><Menu className="h-6 w-6" /></button>
        </div>
        {mobileOpen && <div className="section-shell border-t border-[#0A2540]/8 py-3 md:hidden"><button onClick={() => jump("beranda")} className="block w-full px-2 py-3 text-left text-sm font-semibold">Beranda</button><button onClick={() => openMode("teacher")} className="block w-full px-2 py-3 text-left text-sm font-semibold">Absensi</button><button onClick={() => jump("rekap")} className="block w-full px-2 py-3 text-left text-sm font-semibold">Rekap</button><button onClick={() => openMode("parent")} className="block w-full rounded-xl bg-[#0A2540] px-3 py-3 text-left text-sm font-bold text-[#F5F0E6]">Kirim izin orang tua</button></div>}
      </header>

      {showLogin && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2540]/45 px-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-[28px] bg-[#F5F0E6] p-6 shadow-2xl sm:p-8">
          <div className="mb-6 flex items-start justify-between"><div><div className="mb-2 text-xs font-extrabold uppercase tracking-[.16em] text-[#1f8f64]">Akses guru</div><h2 className="font-display text-2xl font-extrabold text-[#0A2540]">Masuk ke dashboard</h2><p className="mt-2 text-sm leading-6 text-[#74808b]">Kelola absensi IX D dan verifikasi izin orang tua.</p></div><button onClick={() => setShowLogin(false)} className="rounded-xl p-2 text-[#74808b] hover:bg-white"><X className="h-5 w-5" /></button></div>
          <label className="mb-2 block text-xs font-extrabold uppercase tracking-[.13em] text-[#74808b]">Username admin</label><input value={loginUser} onChange={(e) => setLoginUser(e.target.value)} placeholder="contoh: admin" className="w-full rounded-xl border border-[#0A2540]/12 bg-white px-4 py-3 text-sm font-bold text-[#0A2540] outline-none focus:border-[#1f8f64]" />
          <label className="mb-2 mt-4 block text-xs font-extrabold uppercase tracking-[.13em] text-[#74808b]">Password</label><input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="Masukkan password" className="w-full rounded-xl border border-[#0A2540]/12 bg-white px-4 py-3 text-sm font-bold text-[#0A2540] outline-none focus:border-[#1f8f64]" />
          <div className="mt-4 rounded-xl bg-white/70 px-3 py-2 text-xs leading-5 text-[#74808b]">Demo akses: <strong className="text-[#0A2540]">admin</strong> / <strong className="text-[#0A2540]">smp123</strong><br />Sesi guru akan diingat di perangkat ini.</div>
          <button onClick={() => { if (loginUser === "admin" && loginPass === "smp123") { window.localStorage.setItem(TEACHER_SESSION_KEY, "1"); setLoggedIn(true); setShowLogin(false); setMode("teacher"); setNotice("Login guru berhasil. Sesi ini akan diingat di perangkat ini."); window.setTimeout(() => document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" }), 20); } else { setNotice("Username atau password admin belum sesuai."); } }} className="mt-6 w-full rounded-xl bg-[#0A2540] px-4 py-3.5 text-sm font-extrabold text-[#F5F0E6]">Masuk ke dashboard <ArrowRight className="ml-2 inline h-4 w-4" /></button>
        </div>
      </div>}
      {notice && <div className="fixed right-4 top-24 z-50 flex max-w-sm items-center gap-3 rounded-2xl bg-[#0A2540] px-4 py-3 text-sm font-semibold text-[#F5F0E6] shadow-2xl"><CheckCircle2 className="h-5 w-5 text-[#8bd5b3]" />{notice}<button onClick={() => setNotice("")}><X className="h-4 w-4 opacity-70" /></button></div>}
      {proofPreview && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2540]/45 px-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-[28px] bg-[#F5F0E6] p-6 shadow-2xl"><div className="flex items-start justify-between"><div><div className="mb-2 text-xs font-extrabold uppercase tracking-[.16em] text-[#1f8f64]">Bukti pengajuan izin</div><h2 className="font-display text-2xl font-extrabold text-[#0A2540]">{proofPreview === "vn" ? "Voice note orang tua" : "Bukti foto / PDF"}</h2></div><button onClick={() => setProofPreview(null)} className="rounded-xl p-2 text-[#74808b] hover:bg-white"><X className="h-5 w-5" /></button></div><div className="mt-5 rounded-2xl border border-dashed border-[#0A2540]/15 bg-white p-5 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e2f3eb] text-[#1f8f64]">{proofPreview === "vn" ? <Headphones className="h-5 w-5" /> : <FileText className="h-5 w-5" />}</div><div className="mt-3 text-sm font-extrabold text-[#0A2540]">Bukti akan tampil di sini</div><div className="mt-1 text-xs leading-5 text-[#74808b]">Saat orang tua mengirim {proofPreview === "vn" ? "VN" : "foto atau PDF"}, guru dapat memutarnya atau membukanya dari panel ini.</div></div></div></div>}

      <main>
        <section id="beranda" className={`relative overflow-hidden border-b border-[#0A2540]/8 ${teacherOnly || evidenceOnly ? "hidden" : ""}`}>
          <div className="absolute inset-0 bg-grid opacity-60" />
          <div className="section-shell relative grid min-h-[620px] items-center gap-12 py-20 lg:grid-cols-[1.02fr_.98fr] lg:py-24">
            <div className="animate-float-in">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1f8f64]/20 bg-[#e2f3eb] px-3.5 py-2 text-xs font-extrabold uppercase tracking-[.14em] text-[#176746]"><span className="animate-pulse-dot h-2 w-2 rounded-full bg-[#1f8f64]" />Absensi lebih tertata</div>
              <h1 className="max-w-xl font-display text-5xl font-extrabold leading-[1.05] tracking-[-.06em] text-[#0A2540] sm:text-6xl">Hadir hari ini,<br /><span className="text-[#1f8f64]">siap belajar.</span></h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-[#667788]">Satu ruang sederhana untuk mencatat kehadiran, mengirim izin, dan menjaga komunikasi kelas tetap dekat — tanpa kertas yang tercecer.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row"><button onClick={() => openMode("teacher")} className="rounded-2xl bg-[#0A2540] px-5 py-3.5 text-sm font-extrabold text-[#F5F0E6] shadow-xl shadow-[#0A2540]/15 transition hover:-translate-y-0.5 hover:bg-[#143b5d]">Masuk sebagai Guru <ArrowRight className="ml-2 inline h-4 w-4" /></button><button onClick={() => openMode("parent")} className="rounded-2xl border border-[#0A2540]/15 bg-white/50 px-5 py-3.5 text-sm font-extrabold text-[#0A2540] transition hover:bg-white">Kirim Izin (Orang Tua)</button></div>
              <div className="mt-9 flex items-center gap-3 text-sm text-[#667788]"><div className="flex -space-x-2"><span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#F5F0E6] bg-[#d8e7e6] text-[10px] font-bold text-[#0A2540]">NA</span><span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#F5F0E6] bg-[#f0d7ae] text-[10px] font-bold text-[#0A2540]">BM</span><span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#F5F0E6] bg-[#dcd2e7] text-[10px] font-bold text-[#0A2540]">SR</span></div><span>Absensi belum dibuka</span></div>
            </div>
            <div className="relative mx-auto w-full max-w-[510px] animate-float-in [animation-delay:120ms]">
              <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#e8d2a6]/60 blur-3xl" /><div className="absolute -bottom-8 -left-12 h-48 w-48 rounded-full bg-[#c9e3d6]/70 blur-3xl" />
              <div className="relative rounded-[28px] border border-white/70 bg-white/80 p-5 soft-shadow backdrop-blur-xl sm:p-6"><div className="mb-5 flex items-center justify-between"><div><div className="text-xs font-bold uppercase tracking-[.14em] text-[#74808b]">Ringkasan hari ini</div><div className="mt-1 font-display text-2xl font-extrabold text-[#0A2540]">Belum dibuka</div></div><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0A2540] text-[#F5F0E6]"><CalendarDays className="h-5 w-5" /></div></div><div className="rounded-2xl border border-dashed border-[#0A2540]/15 bg-[#fbf9f5] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9edf0] text-[#74808b]"><Clock3 className="h-5 w-5" /></div><div><div className="text-sm font-extrabold text-[#0A2540]">Belum ada absensi</div><div className="mt-1 text-xs leading-5 text-[#74808b]">Ringkasan akan muncul setelah guru membuka absensi hari ini.</div></div></div></div><div className="mt-5 text-center text-xs font-semibold text-[#74808b]">Guru belum membuka sesi absensi hari ini.</div></div>
            </div>
          </div>
        </section>

        <section className={`section-shell py-20 ${teacherOnly || evidenceOnly ? "hidden" : ""}`}><SectionLabel eyebrow="Satu alur, banyak manfaat" title="Absensi yang terasa ringan." copy="Ruang Hadir dirancang untuk rutinitas kelas sehari-hari: cepat bagi guru, jelas bagi orang tua, dan mudah dipahami siswa." /><div className="grid gap-4 md:grid-cols-3"><FeatureCard icon={<LayoutDashboard />} number="01" title="Catat sekali, rapi selamanya" copy="Saat guru membuka absensi, semua data kehadiran tersusun otomatis tanpa spreadsheet yang terpisah." /><FeatureCard icon={<Headphones />} number="02" title="Izin dengan suara" copy="Orang tua cukup rekam pesan suara dan lampirkan bukti bila perlu. Guru bisa mendengar dan memverifikasi." /><FeatureCard icon={<BarChart3 />} number="03" title="Pahami pola kehadiran" copy="Lihat tren mingguan dan bulanan untuk menemukan pola, memberi apresiasi, atau melakukan tindak lanjut." /></div></section>

        <section id="dashboard" className={`${teacherOnly || evidenceOnly ? "hidden" : ""} border-y border-[#0A2540]/8 bg-white/45`}><div className="section-shell py-20"><div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><SectionLabel eyebrow="Panel khusus guru" title="Kelola absensi IX D" copy={attendanceOpen ? "Sesi absensi sedang dibuka · perubahan status terlihat oleh orang tua." : "Sesi belum dibuka · buka absensi saat guru siap mencatat kehadiran."} /><div className="flex flex-wrap gap-2"><button onClick={() => setNotice("Rekap hanya dapat diekspor setelah absensi dibuka.")} className="rounded-xl border border-[#0A2540]/12 bg-white px-4 py-2.5 text-xs font-extrabold text-[#0A2540] transition hover:bg-[#F5F0E6]"><Download className="mr-2 inline h-4 w-4" />Export rekap</button><Link href="/guru/bukti" className="rounded-xl border border-[#1f8f64]/25 bg-[#e2f3eb] px-4 py-2.5 text-xs font-extrabold text-[#176746]">Bukti izin ({permissionRequests.length})</Link><button onClick={toggleAttendance} className={`rounded-xl px-4 py-2.5 text-xs font-extrabold ${attendanceOpen ? "bg-[#c84d4d] text-white" : "bg-[#0A2540] text-[#F5F0E6]"}`}><Radio className="mr-2 inline h-4 w-4" />{attendanceOpen ? "Tutup absensi" : "Buka absensi"}</button>{loggedIn && <button onClick={() => { window.localStorage.removeItem(TEACHER_SESSION_KEY); setLoggedIn(false); setMode("home"); setNotice("Sesi guru di perangkat ini sudah dihapus."); }} className="rounded-xl border border-[#0A2540]/12 bg-white px-3 py-2.5 text-xs font-extrabold text-[#74808b]">Keluar</button>}</div></div><div className="mb-5 grid gap-3 sm:grid-cols-4"><MiniStat label="Total siswa" value={String(students.length)} icon={<Users />} color="#0A2540" /><MiniStat label="Hadir" value={String(students.filter(s => s.status === "Hadir").length)} icon={<CheckCircle2 />} color="#1f8f64" /><MiniStat label="Perlu ditinjau" value={String(reviewCount)} icon={<Clock3 />} color="#c98b21" /><MiniStat label="Alpa" value={String(students.filter(s => s.status === "Alpa").length)} icon={<XCircle />} color="#c84d4d" /></div><div className="overflow-hidden rounded-[24px] border border-[#0A2540]/8 bg-white card-shadow"><div className="flex flex-col gap-3 border-b border-[#0A2540]/8 p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2 text-sm font-extrabold text-[#0A2540]"><span className={`h-2 w-2 rounded-full ${attendanceOpen ? "bg-[#1f8f64]" : "bg-[#c98b21]"}`} />Daftar siswa</div><div className="mt-1 text-xs text-[#74808b]">Pilih status siswa, lalu orang tua dapat melihat hasilnya.</div></div><div className="flex gap-2 text-xs font-bold text-[#74808b]"><button onClick={() => setTeacherFilter("all")} className={`rounded-lg px-3 py-2 ${teacherFilter === "all" ? "bg-[#F5F0E6] text-[#0A2540]" : "hover:bg-[#F5F0E6]"}`}>Semua ({students.length})</button><button onClick={() => setTeacherFilter("review")} className={`rounded-lg px-3 py-2 ${teacherFilter === "review" ? "bg-[#fbefd8] text-[#996715]" : "hover:bg-[#F5F0E6]"}`}><Clock3 className="mr-1 inline h-3.5 w-3.5" />Perlu ditinjau ({reviewCount})</button></div></div><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead className="bg-[#fbf9f5] text-[11px] uppercase tracking-[.14em] text-[#74808b]"><tr><th className="px-5 py-4 font-extrabold">Siswa</th><th className="px-5 py-4 font-extrabold">Status untuk orang tua</th><th className="px-5 py-4 font-extrabold">Catatan</th><th className="px-5 py-4 text-right font-extrabold">Atur status</th></tr></thead><tbody>{visibleStudents.length === 0 ? <tr><td colSpan={4} className="px-5 py-12 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9edf0] text-[#74808b]"><Users className="h-5 w-5" /></div><div className="mt-3 text-sm font-extrabold text-[#0A2540]">{teacherFilter === "review" ? "Tidak ada izin yang perlu ditinjau" : "Daftar siswa masih kosong"}</div><div className="mt-1 text-xs text-[#74808b]">{teacherFilter === "review" ? "Semua pengajuan sudah diproses." : "Tambahkan nama siswa IX D untuk mulai absensi."}</div></td></tr> : visibleStudents.map((student) => <tr key={student.id} className="border-t border-[#0A2540]/6 transition hover:bg-[#fbf9f5]"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e7edf1] text-xs font-extrabold text-[#0A2540]">{student.initials}</span><div><div className="text-sm font-extrabold text-[#0A2540]">{student.name}</div><div className="text-xs text-[#74808b]">{student.className}</div></div></div></td><td className="px-5 py-4"><StatusBadge status={student.status} /></td><td className="px-5 py-4 text-sm text-[#667788]">{student.note}</td><td className="px-5 py-4"><div className="flex flex-wrap justify-end gap-2">{student.status === "Izin" && <><Link href="/guru/bukti" className="rounded-lg bg-[#e2f3eb] px-2.5 py-2 text-[11px] font-extrabold text-[#176746]"><Headphones className="mr-1 inline h-3.5 w-3.5" />Buka bukti</Link></>}<select aria-label={`Ubah status ${student.name}`} disabled={!attendanceOpen} value={student.status} onChange={(e) => updateStatus(student.id, e.target.value as AttendanceStatus)} className="rounded-lg border border-[#0A2540]/10 bg-[#fbf9f5] px-2 py-2 text-xs font-bold text-[#0A2540] disabled:cursor-not-allowed disabled:opacity-50"><option>Belum ditandai</option><option>Hadir</option><option>Izin</option><option>Telat</option><option>Alpa</option></select></div></td></tr>)}</tbody></table></div></div></div></section>

        <section id="izin" className={`section-shell py-20 ${teacherOnly || evidenceOnly ? "hidden" : ""}`}><div className="grid gap-12 lg:grid-cols-[.82fr_1.18fr] lg:items-start"><div><SectionLabel eyebrow="Portal orang tua" title="Kirim izin tanpa antre." copy="Pilih nama anak, rekam suara singkat, lalu kirim. Guru akan menerima notifikasi dan memprosesnya dari dashboard." /><div className="mt-7 space-y-4"><div className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0A2540] text-xs font-extrabold text-[#F5F0E6]">1</span><div><div className="font-extrabold text-[#0A2540]">Lengkapi keterangan</div><div className="mt-1 text-sm leading-6 text-[#74808b]">Pilih siswa dan jenis izin yang sesuai.</div></div></div><div className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0A2540] text-xs font-extrabold text-[#F5F0E6]">2</span><div><div className="font-extrabold text-[#0A2540]">Rekam atau lampirkan bukti</div><div className="mt-1 text-sm leading-6 text-[#74808b]">VN membuat konteks lebih mudah dipahami guru.</div></div></div><div className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0A2540] text-xs font-extrabold text-[#F5F0E6]">3</span><div><div className="font-extrabold text-[#0A2540]">Pantau statusnya</div><div className="mt-1 text-sm leading-6 text-[#74808b]">Notifikasi dikirim setelah izin diverifikasi.</div></div></div></div></div><ParentForm onSent={handlePermissionSent} /></div></section>

        {evidenceOnly && <EvidencePage requests={permissionRequests} onStatusChange={updatePermissionStatus} />}

        <section id="rekap" className={`border-y border-[#0A2540]/8 bg-[#0A2540] text-[#F5F0E6] ${teacherOnly || evidenceOnly ? "hidden" : ""}`}><div className="section-shell py-20"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.18em] text-[#8bd5b3]"><span className="h-1.5 w-1.5 rounded-full bg-[#8bd5b3]" />Rekap kehadiran</div><h2 className="font-display text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">Kelas yang lebih terbaca.</h2><p className="mt-3 max-w-xl text-[15px] leading-7 text-[#b5c5d0]">Pantau ritme kehadiran kelas dalam satu tampilan. Data mingguan menjadi bahan percakapan yang lebih bermakna.</p></div><div className="flex rounded-xl bg-white/10 p-1 text-xs font-bold"><button className="rounded-lg bg-[#F5F0E6] px-4 py-2 text-[#0A2540]">Mingguan</button><button className="rounded-lg px-4 py-2 text-[#b5c5d0]">Bulanan</button></div></div><AttendanceChart /></div></section>
      </main>

      <footer id="kontak" className={`bg-[#F5F0E6] ${teacherOnly || evidenceOnly ? "hidden" : ""}`}><div className="section-shell grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]"><div><Logo compact /><p className="mt-5 max-w-xs text-sm leading-6 text-[#74808b]">Ruang kecil untuk menjaga kehadiran, komunikasi, dan rasa saling peduli di kelas.</p></div><div><div className="mb-4 text-xs font-extrabold uppercase tracking-[.16em] text-[#0A2540]">Kelas kami</div><div className="space-y-2 text-sm text-[#667788]"><div>IX D · SMP PGRI 1 CIDAHU</div><div>Wali kelas: Dewi.A.Noviana</div><div>Senin–Jumat · 06.45–15.00</div></div></div><div><div className="mb-4 text-xs font-extrabold uppercase tracking-[.16em] text-[#0A2540]">Butuh bantuan?</div><div className="space-y-3 text-sm text-[#667788]"><a href="mailto:kelas@ruanghadir.id" className="block hover:text-[#0A2540]">kelas@ruanghadir.id</a><a href="tel:+62215550123" className="block hover:text-[#0A2540]">(021) 555 0123</a><div className="flex gap-3 pt-1"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#0A2540]"><CircleHelp className="h-4 w-4" /></span><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#0A2540]"><ShieldCheck className="h-4 w-4" /></span></div></div></div></div><div className="border-t border-[#0A2540]/8"><div className="section-shell flex flex-col justify-between gap-2 py-5 text-xs text-[#74808b] sm:flex-row"><span>© 2024 Ruang Hadir · IX D · SMP PGRI 1 CIDAHU</span><span>Dibuat untuk kelas yang saling menjaga.</span></div></div></footer>
    </div>
  );
}

function FeatureCard({ icon, number, title, copy }: { icon: React.ReactNode; number: string; title: string; copy: string }) { return <div className="rounded-[24px] border border-[#0A2540]/8 bg-white/70 p-6 transition hover:-translate-y-1 hover:bg-white card-shadow"><div className="mb-8 flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0A2540] text-[#F5F0E6]">{icon}</span><span className="font-display text-sm font-extrabold text-[#c7ced2]">{number}</span></div><h3 className="font-display text-lg font-extrabold text-[#0A2540]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#74808b]">{copy}</p></div>; }
function MiniStat({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) { return <div className="flex items-center gap-3 rounded-2xl border border-[#0A2540]/8 bg-white p-4"><span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ color, background: `${color}15` }}>{icon}</span><div><div className="font-display text-xl font-extrabold text-[#0A2540]">{value}</div><div className="text-[11px] font-bold text-[#74808b]">{label}</div></div></div>; }

function EvidencePage({ requests, onStatusChange }: { requests: PermissionRequest[]; onStatusChange: (id: string, status: PermissionRequest["status"]) => void }) {
  return <section className="section-shell py-20"><div className="mb-8 flex items-end justify-between gap-4"><div><SectionLabel eyebrow="Panel guru" title="Bukti izin masuk" copy="Dengarkan VN dan buka bukti yang dikirim orang tua. Keputusan verifikasi tetap ditentukan guru." /><Link href="/guru" className="text-sm font-extrabold text-[#176746] underline">← Kembali ke dashboard</Link></div><div className="rounded-2xl bg-[#e2f3eb] px-4 py-3 text-center"><div className="font-display text-2xl font-extrabold text-[#176746]">{requests.length}</div><div className="text-xs font-bold text-[#4b806b]">Pengajuan</div></div></div>{requests.length === 0 ? <div className="rounded-[24px] border border-dashed border-[#0A2540]/15 bg-white p-12 text-center card-shadow"><FileText className="mx-auto h-10 w-10 text-[#9aa5ad]" /><div className="mt-4 font-display text-xl font-extrabold text-[#0A2540]">Belum ada bukti izin</div><p className="mt-2 text-sm text-[#74808b]">Bukti VN dan file dari orang tua akan muncul di sini setelah dikirim.</p></div> : <div className="grid gap-4">{requests.map((request) => <article key={request.id} className="rounded-[24px] border border-[#0A2540]/8 bg-white p-5 card-shadow"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><div className="text-xs font-extrabold uppercase tracking-[.14em] text-[#74808b]">{request.kind} · {new Date(request.createdAt).toLocaleString("id-ID")}</div><h3 className="mt-2 font-display text-xl font-extrabold text-[#0A2540]">{request.student}</h3><span className="mt-2 inline-flex rounded-full bg-[#fbefd8] px-3 py-1 text-xs font-bold text-[#996715]">{request.status}</span></div><div className="flex flex-wrap gap-2">{request.voiceUrl && <a href={request.voiceUrl} download={`VN-${request.student}.webm`} className="rounded-xl bg-[#e2f3eb] px-3 py-2 text-xs font-extrabold text-[#176746]"><Headphones className="mr-1 inline h-4 w-4" />Unduh VN</a>}{request.evidenceUrl && <a href={request.evidenceUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-[#eef1f3] px-3 py-2 text-xs font-extrabold text-[#5d6973]"><FileText className="mr-1 inline h-4 w-4" />Buka {request.evidenceName || "bukti"}</a>}</div></div>{request.status === "Menunggu verifikasi" && <div className="mt-4 flex flex-wrap gap-2"><button onClick={() => onStatusChange(request.id, "Disetujui")} className="rounded-xl bg-[#1f8f64] px-4 py-2 text-xs font-extrabold text-white">Setujui izin</button><button onClick={() => onStatusChange(request.id, "Ditolak")} className="rounded-xl bg-[#f9e1df] px-4 py-2 text-xs font-extrabold text-[#a33f3f]">Tolak izin</button></div>}{request.voiceUrl && <audio className="mt-5 h-10 w-full" controls src={request.voiceUrl} />}{request.evidenceUrl && request.evidenceUrl.startsWith("data:image") && <img src={request.evidenceUrl} alt={`Bukti ${request.student}`} className="mt-5 max-h-80 rounded-2xl border border-[#0A2540]/8 object-contain" />}</article>)}</div>}</section>;
}

function ParentForm({ onSent }: { onSent: (request: PermissionRequest) => void }) {
  const [student, setStudent] = useState(studentNames[0] ?? "");
  const [kind, setKind] = useState("Sakit");
  const [studentSearch, setStudentSearch] = useState("");
  const [studentMenuOpen, setStudentMenuOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [evidence, setEvidence] = useState<File | null>(null);
  const [voiceUrl, setVoiceUrl] = useState("");
  const [recordingError, setRecordingError] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [sent, setSent] = useState(false);
  const timer = useRef<number | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    setRecordingError("");
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { setRecordingError("Browser ini belum mendukung rekaman suara."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunks.current = [];
      recorder.ondataavailable = (event) => { if (event.data.size > 0) chunks.current.push(event.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onload = () => setVoiceUrl(String(reader.result ?? ""));
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
      setSeconds(0);
      timer.current = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    } catch {
      setRecording(false);
      setRecordingError("Mikrofon belum diizinkan. Tekan izinkan pada pop-up browser, lalu coba lagi.");
    }
  };
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
    setMediaRecorder(null);
    setRecording(false);
    if (timer.current) window.clearInterval(timer.current);
  };
  const send = async () => {
    const evidenceUrl = evidence ? await fileToDataUrl(evidence) : "";
    onSent({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, student, kind, voiceUrl, evidenceUrl, evidenceName: evidence?.name ?? "", createdAt: new Date().toISOString(), status: "Menunggu verifikasi" });
    setSent(true); stopRecording();
  };
  const filteredStudents = studentNames.filter((name) => name.toLowerCase().includes(studentSearch.toLowerCase()));

  return <div className="rounded-[28px] border border-[#0A2540]/8 bg-white p-5 card-shadow sm:p-7"><div className="mb-6 flex items-start justify-between"><div><div className="font-display text-xl font-extrabold text-[#0A2540]">Formulir izin</div><div className="mt-1 text-sm text-[#74808b]">Pilih siswa, rekam VN, lalu kirim ke guru</div></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e2f3eb] text-[#1f8f64]"><FileText className="h-5 w-5" /></div></div>{sent ? <div className="rounded-2xl bg-[#e2f3eb] p-5"><CheckCircle2 className="h-8 w-8 text-[#1f8f64]" /><div className="mt-3 font-display text-lg font-extrabold text-[#176746]">Izin terkirim.</div><p className="mt-1 text-sm leading-6 text-[#4b806b]">Guru akan menerima VN/bukti dan memverifikasinya dari dashboard.</p><button onClick={() => setSent(false)} className="mt-4 text-sm font-extrabold text-[#176746] underline">Kirim izin lain</button></div> : <><label className="mb-2 block text-xs font-extrabold uppercase tracking-[.13em] text-[#74808b]">Pilih siswa <span className="font-medium normal-case tracking-normal text-[#1f8f64]">· 39 siswa</span></label><div className="relative"><button type="button" onClick={() => setStudentMenuOpen((open) => !open)} className="flex w-full items-center gap-3 rounded-xl border border-[#0A2540]/12 bg-[#fbf9f5] px-3 py-2.5 text-left outline-none transition hover:border-[#1f8f64]"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e7edf1] text-xs font-extrabold text-[#0A2540]">{student.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><span className="flex-1"><span className="block text-sm font-extrabold text-[#0A2540]">{student}</span><span className="mt-0.5 block text-[11px] text-[#74808b]">IX D · ketuk untuk mengganti</span></span><ChevronDown className={`h-4 w-4 text-[#74808b] transition ${studentMenuOpen ? "rotate-180" : ""}`} /></button>{studentMenuOpen && <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-2xl border border-[#0A2540]/10 bg-white p-2 shadow-2xl"><div className="relative"><Users className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#74808b]" /><input autoFocus value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} placeholder="Cari nama siswa..." className="w-full rounded-xl bg-[#F5F0E6] py-2.5 pl-9 pr-3 text-sm font-semibold text-[#0A2540] outline-none" /></div><div className="mt-2 max-h-52 space-y-1 overflow-y-auto">{filteredStudents.map((name) => <button type="button" key={name} onClick={() => { setStudent(name); setStudentMenuOpen(false); setStudentSearch(""); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-[#F5F0E6] ${name === student ? "bg-[#e2f3eb]" : ""}`}><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e7edf1] text-[10px] font-extrabold text-[#0A2540]">{name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><span className="text-sm font-bold text-[#0A2540]">{name}</span>{name === student && <Check className="ml-auto h-4 w-4 text-[#1f8f64]" />}</button>)}</div></div>}</div><label className="mb-2 mt-5 block text-xs font-extrabold uppercase tracking-[.13em] text-[#74808b]">Jenis keterangan</label><div className="grid grid-cols-2 gap-2"><button onClick={() => setKind("Sakit")} className={`rounded-xl border px-4 py-3 text-sm font-extrabold transition ${kind === "Sakit" ? "border-[#0A2540] bg-[#0A2540] text-[#F5F0E6]" : "border-[#0A2540]/10 bg-[#fbf9f5] text-[#74808b]"}`}>Sakit</button><button onClick={() => setKind("Keperluan keluarga")} className={`rounded-xl border px-4 py-3 text-sm font-extrabold transition ${kind === "Keperluan keluarga" ? "border-[#0A2540] bg-[#0A2540] text-[#F5F0E6]" : "border-[#0A2540]/10 bg-[#fbf9f5] text-[#74808b]"}`}>Keperluan keluarga</button></div><div className="mt-5 rounded-2xl border border-dashed border-[#1f8f64]/35 bg-[#f5fbf7] p-4"><div className="flex items-center gap-3"><button onClick={recording ? stopRecording : startRecording} className={`flex h-11 w-11 items-center justify-center rounded-xl ${recording ? "bg-[#c84d4d] text-white" : "bg-[#1f8f64] text-white"}`}>{recording ? <span className="h-3 w-3 rounded-sm bg-white" /> : <Mic className="h-5 w-5" />}</button><div className="flex-1"><div className="text-sm font-extrabold text-[#0A2540]">{recording ? `Merekam suara · 00:${String(seconds).padStart(2, "0")}` : voiceUrl ? "VN siap dikirim" : "Rekam VN untuk guru"}</div><div className="mt-1 text-xs text-[#74808b]">{recording ? "Tekan tombol untuk berhenti" : "Izinkan mikrofon jika diminta browser"}</div></div>{recording && <div className="flex items-end gap-0.5">{[3,8,5,11,7,14,6,10].map((height, index) => <span key={index} className="w-1 rounded-full bg-[#1f8f64]" style={{ height }} />)}</div>}</div>{voiceUrl && <audio className="mt-3 h-9 w-full" controls src={voiceUrl} />}{recordingError && <div className="mt-3 rounded-xl bg-[#fff1f0] px-3 py-2 text-xs font-bold leading-5 text-[#b34343]">{recordingError}</div>}</div><label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl border border-[#0A2540]/10 bg-[#fbf9f5] p-4 transition hover:bg-[#F5F0E6]"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#0A2540]"><Paperclip className="h-4 w-4" /></span><span className="flex-1"><span className="block text-sm font-extrabold text-[#0A2540]">Lampirkan bukti <span className="font-medium text-[#74808b]">(opsional)</span></span><span className="mt-1 block text-xs text-[#74808b]">Foto atau PDF · maks. 5 MB</span></span><input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setEvidence(e.target.files?.[0] ?? null)} />{evidence ? <Check className="h-5 w-5 text-[#1f8f64]" /> : <Plus className="h-5 w-5 text-[#74808b]" />}</label>{evidence && <div className="mt-2 truncate text-xs font-bold text-[#1f8f64]">Terpilih: {evidence.name}</div>}<button onClick={send} className="mt-6 w-full rounded-xl bg-[#0A2540] px-4 py-3.5 text-sm font-extrabold text-[#F5F0E6] shadow-lg shadow-[#0A2540]/15 transition hover:bg-[#143b5d]">Kirim izin <ArrowRight className="ml-2 inline h-4 w-4" /></button></>}</div>;
}

function AttendanceChart() { const data = useMemo(() => [{ day: "Sen", value: 91 }, { day: "Sel", value: 88 }, { day: "Rab", value: 94 }, { day: "Kam", value: 86 }, { day: "Jum", value: 90 }], []); return <div className="mt-10 rounded-[24px] border border-white/10 bg-white/8 p-5 sm:p-7"><div className="mb-8 flex items-center justify-between"><div><div className="font-display text-2xl font-extrabold">89,8%</div><div className="mt-1 text-sm text-[#b5c5d0]">Rata-rata kehadiran minggu ini</div></div><div className="flex items-center gap-2 text-xs font-bold text-[#8bd5b3]"><span className="h-2 w-2 rounded-full bg-[#8bd5b3]" />Naik 4,2% dari minggu lalu</div></div><div className="flex h-48 items-end justify-between gap-3 border-b border-white/15 px-1 sm:gap-8">{data.map((item) => <div key={item.day} className="flex h-full flex-1 flex-col items-center justify-end gap-3"><div className="relative w-full max-w-16 rounded-t-xl bg-[#8bd5b3] transition hover:bg-[#b7e8ce]" style={{ height: `${item.value * 1.55}px` }}><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-extrabold text-[#8bd5b3]">{item.value}%</span></div><span className="mb-[-28px] text-xs font-bold text-[#b5c5d0]">{item.day}</span></div>)}</div><div className="mt-12 flex flex-wrap gap-4 text-xs text-[#b5c5d0]"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#8bd5b3]" />Kehadiran tercatat</span><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#f0d7ae]" />Target kelas 90%</span></div></div>; }

export default Home;
