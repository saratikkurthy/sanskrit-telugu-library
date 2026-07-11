PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_file_activity` (
	`id` integer PRIMARY KEY NOT NULL,
	`file_id` integer,
	`accessed_at` integer DEFAULT '"2026-07-10T18:55:08.434Z"',
	`interaction_type` text,
	FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_file_activity`("id", "file_id", "accessed_at", "interaction_type") SELECT "id", "file_id", "accessed_at", "interaction_type" FROM `file_activity`;--> statement-breakpoint
DROP TABLE `file_activity`;--> statement-breakpoint
ALTER TABLE `__new_file_activity` RENAME TO `file_activity`;--> statement-breakpoint
PRAGMA foreign_keys=ON;