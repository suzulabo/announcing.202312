CREATE TABLE `announcements` (
	`channelID` text NOT NULL,
	`userID` text NOT NULL,
	`announcementID` text NOT NULL,
	`headerImage` text,
	`title` text,
	`body` text NOT NULL,
	`images` text,
	`updatedAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	PRIMARY KEY(`channelID`, `announcementID`),
	FOREIGN KEY (`channelID`) REFERENCES `channels`(`channelID`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `blobs` (
	`blobID` text PRIMARY KEY NOT NULL,
	`contentType` text NOT NULL,
	`blob` blob NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `channels` (
	`channelID` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`desc` text,
	`icon` text,
	`announcementIDs` text,
	`updatedAt` integer NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `owners` (
	`channelID` text NOT NULL,
	`userID` text NOT NULL,
	`createdAt` integer NOT NULL,
	PRIMARY KEY(`channelID`, `userID`),
	FOREIGN KEY (`channelID`) REFERENCES `channels`(`channelID`) ON UPDATE no action ON DELETE cascade
);
