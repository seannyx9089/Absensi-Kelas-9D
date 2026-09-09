# Absensi Siswa Kelas 9D

Website sistem absensi untuk **SMP PGRI 1 CIDAHU — Kelas IX D** dengan wali kelas **Dewi.A.Noviana**.

## Fitur

- Landing page responsif dengan logo kelas IX D.
- Login admin guru dengan dashboard absensi.
- Status Hadir, Izin, Telat, dan Alpa.
- Picker siswa dengan pencarian dan daftar 39 siswa.
- Form izin orang tua dengan rekam VN dan upload bukti opsional.
- Rekap kehadiran mingguan/bulanan.
- MySQL + Drizzle ORM dan API tRPC.
- File media diarahkan ke storage eksternal, bukan disimpan sebagai BLOB di database.

## Menjalankan lokal

```bash
pnpm install
pnpm dev
```

## Environment variable

Salin `.env.example` menjadi `.env` untuk lokal. Pada Railway, masukkan variable yang sama melalui tab **Variables**.

```env
DATABASE_URL=mysql://user:password@host:3306/database
# Alternatif nama variable Railway:
MYSQL_URL=mysql://user:password@host:3306/database
JWT_SECRET=ganti-dengan-secret-panjang
VITE_APP_ID=isi-jika-mengaktifkan-Manus-OAuth
OAUTH_SERVER_URL=https://api.manus.im
BUILT_IN_FORGE_API_URL=isi-jika-mengaktifkan-storage-eksternal
BUILT_IN_FORGE_API_KEY=isi-jika-mengaktifkan-storage-eksternal
```

`DATABASE_URL` diprioritaskan; jika tidak tersedia, aplikasi menggunakan `MYSQL_URL`.

## Deploy ke Railway

1. Buat project baru di Railway dari repository GitHub ini.
2. Tambahkan service MySQL Railway, lalu salin connection string-nya ke `DATABASE_URL` atau `MYSQL_URL`.
3. Tambahkan `JWT_SECRET` dan variable storage/OAuth bila fitur tersebut diaktifkan.
4. Railway akan menjalankan `pnpm install`, build menggunakan script `build`, lalu menjalankan `pnpm start`.
5. Setelah deploy, jalankan migrasi database dari environment Railway dengan `pnpm drizzle-kit migrate` bila tabel belum tersedia.

> Untuk produksi, ganti kredensial demo admin di alur autentikasi dengan akun guru yang tersimpan aman di database. Kredensial demo pada prototype saat ini adalah `admin` / `smp123`.
