CREATE TABLE `ad_plays` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content_daily_id` integer NOT NULL,
	`ad_name` text NOT NULL,
	`plays` integer NOT NULL,
	FOREIGN KEY (`content_daily_id`) REFERENCES `content_daily`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `ad_plays_parent_idx` ON `ad_plays` (`content_daily_id`);--> statement-breakpoint
CREATE TABLE `admin_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'admin' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_email_unique` ON `admin_users` (`email`);--> statement-breakpoint
CREATE TABLE `area_readings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`store_id` text NOT NULL,
	`ts` integer NOT NULL,
	`area_count` integer NOT NULL,
	`temp` real,
	`humidity` real,
	`pressure` real,
	FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `area_readings_store_ts_idx` ON `area_readings` (`store_id`,`ts`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` text,
	`action` text NOT NULL,
	`target_type` text,
	`target_id` text,
	`meta` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`actor_id`) REFERENCES `admin_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `audit_logs_created_at_idx` ON `audit_logs` (`created_at`);--> statement-breakpoint
CREATE TABLE `content_breakdown` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content_daily_id` integer NOT NULL,
	`dimension` text NOT NULL,
	`key` text NOT NULL,
	`value` integer NOT NULL,
	FOREIGN KEY (`content_daily_id`) REFERENCES `content_daily`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `content_breakdown_parent_idx` ON `content_breakdown` (`content_daily_id`);--> statement-breakpoint
CREATE TABLE `content_daily` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`store_id` text NOT NULL,
	`date` text NOT NULL,
	`total_plays` integer NOT NULL,
	FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `content_daily_store_date_idx` ON `content_daily` (`store_id`,`date`);--> statement-breakpoint
CREATE TABLE `daily_metrics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`store_id` text NOT NULL,
	`date` text NOT NULL,
	`district` integer NOT NULL,
	`area` integer NOT NULL,
	`store_visits` integer NOT NULL,
	FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `daily_metrics_store_date_idx` ON `daily_metrics` (`store_id`,`date`);--> statement-breakpoint
CREATE TABLE `flow_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`flow_daily_id` integer NOT NULL,
	`direction` text NOT NULL,
	`category` text NOT NULL,
	`value` integer NOT NULL,
	FOREIGN KEY (`flow_daily_id`) REFERENCES `flow_daily`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `flow_categories_parent_idx` ON `flow_categories` (`flow_daily_id`);--> statement-breakpoint
CREATE TABLE `flow_daily` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`store_id` text NOT NULL,
	`date` text NOT NULL,
	`inbound` integer NOT NULL,
	`internal` integer NOT NULL,
	`outbound` integer NOT NULL,
	FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `flow_daily_store_date_idx` ON `flow_daily` (`store_id`,`date`);--> statement-breakpoint
CREATE TABLE `liff_page_views` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`store_id` text NOT NULL,
	`line_user_id` text,
	`page` text NOT NULL,
	`viewed_at` integer NOT NULL,
	FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `liff_page_views_store_idx` ON `liff_page_views` (`store_id`);--> statement-breakpoint
CREATE INDEX `liff_page_views_page_idx` ON `liff_page_views` (`page`);--> statement-breakpoint
CREATE TABLE `stores` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text NOT NULL,
	`lat` real,
	`lng` real,
	`category` text NOT NULL,
	`line_id` text,
	`access_code` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `stores_phone_idx` ON `stores` (`phone`);--> statement-breakpoint
CREATE UNIQUE INDEX `stores_line_id_idx` ON `stores` (`line_id`);