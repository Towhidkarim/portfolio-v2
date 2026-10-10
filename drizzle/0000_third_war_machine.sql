CREATE TABLE `image` (
	`id` text PRIMARY KEY NOT NULL,
	`r2Key` text NOT NULL,
	`fileName` text,
	`fileSize` integer,
	`fileUrl` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `image_r2Key_unique` ON `image` (`r2Key`);--> statement-breakpoint
CREATE TABLE `mail` (
	`id` text PRIMARY KEY NOT NULL,
	`sentAt` text NOT NULL,
	`senderName` text NOT NULL,
	`senderEmail` text NOT NULL,
	`message` text NOT NULL,
	`readAt` text,
	`archivedAt` text
);
--> statement-breakpoint
CREATE INDEX `mail_inbox_idx` ON `mail` (`archivedAt`,`sentAt`);--> statement-breakpoint
CREATE TABLE `project` (
	`id` text PRIMARY KEY NOT NULL,
	`projectName` text NOT NULL,
	`displayIndex` integer DEFAULT 0 NOT NULL,
	`imgUrl` text NOT NULL,
	`imgID` text NOT NULL,
	`tags` text,
	`summary` text NOT NULL,
	`description` text,
	`enabled` integer DEFAULT true NOT NULL,
	`demoLink` text NOT NULL,
	`sourceLink` text NOT NULL,
	FOREIGN KEY (`imgID`) REFERENCES `image`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `project_public_idx` ON `project` (`enabled`,`displayIndex`);