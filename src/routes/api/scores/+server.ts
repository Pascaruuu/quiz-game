import { json } from '@sveltejs/kit';
import { saveScore } from '$lib/server/db_controller';
import type { RequestEvent } from '@sveltejs/kit';

export const POST = async ({ request }: RequestEvent) => {
  const body = await request.json();
  console.log('Score save received:', body);

  const { username, score } = body;

  if (!username || username.trim().length < 2) {
    return json({ error: 'Invalid username' }, { status: 400 });
  }

  if (isNaN(score) || score < 0) {
    return json({ error: 'Invalid score' }, { status: 400 });
  }

  try {
    await saveScore(username, score);
    console.log('Score saved successfully:', username, score);
    return json({ success: true });
  } catch (err) {
    console.error('Score save error:', err);
    return json({ error: 'Failed to save score' }, { status: 500 });
  }
};