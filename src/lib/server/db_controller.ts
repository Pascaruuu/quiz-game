import { db } from './db';
import { scoreboard } from '$lib/db/schema';
import { desc, notInArray } from 'drizzle-orm';

export async function getLeaderboard() {
    return await db.select()
        .from(scoreboard)
        .orderBy(desc(scoreboard.score))
        .limit(10);
}

export async function saveScore(username: string, score: number) {
    const current = await db.select()
        .from(scoreboard)
        .orderBy(desc(scoreboard.score))
        .limit(10);

    if (current.length >= 10) {
        const lowestScore = current[current.length - 1].score;
        if (score <= lowestScore) return; 
    }

    await db.insert(scoreboard).values({ username, score });

    const top10 = await db.select({ id: scoreboard.id })
        .from(scoreboard)
        .orderBy(desc(scoreboard.score))
        .limit(10);

    const top10ids = top10.map(r => r.id);

    if (top10ids.length > 0) {
        await db.delete(scoreboard)
            .where(notInArray(scoreboard.id, top10ids));
    }
}