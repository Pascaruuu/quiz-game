import { json } from '@sveltejs/kit';
import { saveScore } from '$lib/server/db_controller';
import type { RequestEvent } from '@sveltejs/kit';

// Max possible score: 15 questions × 100 pts × 3x multiplier
const MAX_POSSIBLE_SCORE = 20 * 100 * 3;

// Rate limiting: 1 submission per 30s per IP
const submissions = new Map<string, number>();

export const POST = async ({ request, getClientAddress }: RequestEvent) => {
	// Rate limit check
	const ip = getClientAddress();
	const last = submissions.get(ip) ?? 0;
	if (Date.now() - last < 30000) {
		//30s cooldown
		return json({ error: 'Too many submissions' }, { status: 429 });
	}
	submissions.set(ip, Date.now());

	const body = await request.json();
	const { username, score } = body;

	if (!username || username.trim().length < 2) {
		return json({ error: 'Invalid username' }, { status: 400 });
	}

	if (isNaN(score) || score < 0) {
		return json({ error: 'Invalid score' }, { status: 400 });
	}

	// Block impossible scores
	if (score > MAX_POSSIBLE_SCORE) {
		return json({ error: 'Invalid score' }, { status: 400 });
	}

	try {
		await saveScore(username, score);
		return json({ success: true });
	} catch (err) {
		console.error('Score save error:', err);
		return json({ error: 'Failed to save score' }, { status: 500 });
	}
};
