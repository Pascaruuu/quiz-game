// change this later, this is mock data
import type { PageServerLoad } from './$types';

export interface Player {
    rank: number;
    name: string;
    score: number;
    timePlayed: string;
}

export const load: PageServerLoad = async () => {
    // Mocking an API response
    const players: Player[] = [
        { rank: 1, name: "NeonSamurai", score: 9850, timePlayed: "12h 30m" },
        { rank: 2, name: "SvelteWizard", score: 8720, timePlayed: "8h 45m" },
        { rank: 3, name: "TypeScripter", score: 7500, timePlayed: "15h 10m" },
        { rank: 4, name: "GhostRunner", score: 6200, timePlayed: "4h 20m" },
        { rank: 5, name: "AsyncAce", score: 5900, timePlayed: "20h 05m" }
    ];

    return { players };
};