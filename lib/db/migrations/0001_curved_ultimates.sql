PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_echoes` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`note` text,
	`lat` real,
	`lng` real,
	`location_name` text,
	`audio_path` text NOT NULL,
	`duration_ms` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`synced_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_echoes`("id", "title", "note", "lat", "lng", "location_name", "audio_path", "duration_ms", "created_at", "updated_at", "synced_at") SELECT "id", "title", "note", "lat", "lng", "location_name", "audio_path", "duration_ms", "created_at", "updated_at", "synced_at" FROM `echoes`;--> statement-breakpoint
DROP TABLE `echoes`;--> statement-breakpoint
ALTER TABLE `__new_echoes` RENAME TO `echoes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `echoes_created_at_idx` ON `echoes` (`created_at`);--> statement-breakpoint
CREATE INDEX `echoes_location_idx` ON `echoes` (`lat`,`lng`);