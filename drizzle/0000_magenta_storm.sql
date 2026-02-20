CREATE TABLE `scoreboard` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`score` integer NOT NULL,
	`createdAt` text DEFAULT (DATETIME('now')) NOT NULL
);
