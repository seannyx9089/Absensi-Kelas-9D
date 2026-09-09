CREATE TABLE `attendance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`tanggal` date NOT NULL,
	`status` enum('Hadir','Izin','Alpa','Telat') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `attendance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `parents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(160) NOT NULL,
	`no_hp` varchar(32) NOT NULL,
	`student_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `parents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `permission_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`tanggal` date NOT NULL,
	`jenis` varchar(80) NOT NULL,
	`file_vn_url` text,
	`file_bukti_url` text,
	`status_verifikasi` enum('Menunggu','Disetujui','Ditolak') NOT NULL DEFAULT 'Menunggu',
	`catatan_guru` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`verified_at` timestamp,
	CONSTRAINT `permission_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(160) NOT NULL,
	`kelas` varchar(32) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `students_id` PRIMARY KEY(`id`)
);
