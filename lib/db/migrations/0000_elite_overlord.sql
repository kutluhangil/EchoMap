CREATE TABLE `echoes` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`note` text,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`location_name` text,
	`audio_path` text NOT NULL,
	`duration_ms` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`synced_at` integer
);
--> statement-breakpoint
CREATE INDEX `echoes_created_at_idx` ON `echoes` (`created_at`);--> statement-breakpoint
CREATE INDEX `echoes_location_idx` ON `echoes` (`lat`,`lng`);