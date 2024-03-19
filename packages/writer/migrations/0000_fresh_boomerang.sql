CREATE TABLE `threadOwners` (
	`threadID` integer NOT NULL,
	`userID` text PRIMARY KEY NOT NULL,
	PRIMARY KEY(`threadID`, `userID`),
	FOREIGN KEY (`threadID`) REFERENCES `threads`(`threadID`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`userID`) REFERENCES `users`(`userID`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `threads` (
	`threadID` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`desc` text,
	`icon` text,
	`links` text,
	`updatedAt` integer,
	`createdAt` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`userID` text PRIMARY KEY NOT NULL
);
