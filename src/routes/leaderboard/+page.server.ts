import type { PageServerLoad } from './$types';
import { getLeaderboard } from '$lib/server/db_controller';

export const load: PageServerLoad = () => {
	return {
		players: getLeaderboard().then((rawLeaderboard) =>
			rawLeaderboard.map((row, index) => ({
				rank: index + 1,
				name: row.username,
				score: row.score,
				timePlayed: new Date(row.createdAt).toLocaleDateString(),
			})),
		),
	};
};
