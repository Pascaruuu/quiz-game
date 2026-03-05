import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const scoreboard = sqliteTable('scoreboard', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	username: text('username').notNull(),
	score: integer('score').notNull(),
	createdAt: text('createdAt')
		.default(sql`(DATETIME('now'))`)
		.notNull(),
});

// export const dictionary = sqliteTable("dictionary", {
//   id: integer("id").primaryKey({ autoIncrement: true }),
//   question: text("question").notNull().unique(),
//   answer: text("answer").notNull(),
//   createdAt: text("createdAt").default(sql`(DATETIME('now'))`).notNull(),
//   modifiedAt: text("modifiedAt").default(sql`(DATETIME('now'))`).notNull(),
// });
