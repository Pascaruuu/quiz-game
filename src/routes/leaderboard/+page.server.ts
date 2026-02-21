// change this later, this is mock data
import type { PageServerLoad } from './$types';
import { getLeaderboard } from '$lib/server/db_controller';

// export interface Player {
//     rank: number;
//     name: string;
//     score: number;
//     timePlayed: string;
// }

export const load: PageServerLoad = async () => {
	const rawLeaderboard = await getLeaderboard();
	const players = rawLeaderboard.map((row, index) => ({
		rank: index + 1,
		name: row.username,
		score: row.score,
		timePlayed: new Date(row.createdAt).toLocaleDateString()
	}));

	return { players };
};
