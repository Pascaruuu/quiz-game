import { db } from './db';
import { scoreboard } from '$lib/db/schema';
import { desc } from 'drizzle-orm';

// Get Top 10
export async function getLeaderboard() {
	return await db.select().from(scoreboard).orderBy(desc(scoreboard.score)).limit(10);
}

export async function saveScore(username: string, score: number) {
	return await db.insert(scoreboard).values({ username, score });
}
