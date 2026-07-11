CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`file_id` integer,
	`is_global` integer DEFAULT false,
	`category_id` integer,
	FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `file_activity` (
	`id` integer PRIMARY KEY NOT NULL,
	`file_id` integer,
	`accessed_at` integer DEFAULT '"2026-07-10T18:42:58.265Z"',
	`interaction_type` text,
	FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `files` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`file_name` text NOT NULL,
	`file_path` text NOT NULL,
	`file_hash` text NOT NULL,
	`file_size` integer NOT NULL,
	`title` text,
	`author` text,
	`language` text,
	`category` text,
	`category_id` integer,
	`created_at` integer,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `files_file_path_unique` ON `files` (`file_path`);--> statement-breakpoint
CREATE INDEX `idx_file_name` ON `files` (`file_name`);