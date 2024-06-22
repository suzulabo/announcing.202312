CREATE TABLE `channels` (
	`channelID` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`desc` text,
	`icon` text,
	`links` text,
	`announcements` text,
	`owners` text NOT NULL,
	`updatedAt` integer NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`userID` text PRIMARY KEY NOT NULL,
	`channels` text
);
