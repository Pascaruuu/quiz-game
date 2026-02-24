import { json } from '@sveltejs/kit';
import { saveScore } from '$lib/server/db_controller';
import type { RequestEvent } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

// Rate limiting: 1 submission per 30s per IP
const submissions = new Map<string, number>();

export const POST = async ({ request, getClientAddress }: RequestEvent) => {
  // Rate limit check
  const ip = getClientAddress();
  const last = submissions.get(ip) ?? 0;
  if (Date.now() - last < 30000) { //30s cooldown
    return json({ error: 'Too many submissions' }, { status: 429 });
  }
  submissions.set(ip, Date.now());

  const body = await request.json();
  const { username, result, token } = body;

  // Guard against missing nested objects
  if (!result) return json({ error: 'Missing result data' }, { status: 400 });

  const { score, allStreaks } = result;

  // jwt validation
  if (!token) return json({ error: 'No session token' }, { status: 401 });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET) as { count: number, iat: number}
  } catch {
    return json({ error: 'Invalid or expired session token' }, { status: 401 });
  }

  // anti-cheat: logic validation
  let serverCalculatedScore = 0;
  const pointsPerCorrect = 100;
  const penalty = Math.round(pointsPerCorrect * 0.5);

  // Replay the game logic based on the streak status array
  for (const comboAtStep of allStreaks) {
    if (comboAtStep > 0) {
      // It was a correct answer
      // Multiplier logic: 1, 1.5, 2, 2.5, 3
      const multiplier = comboAtStep >= 5 ? 3 : 1 + (Math.max(0, comboAtStep - 1) * 0.5);
      serverCalculatedScore += Math.round(pointsPerCorrect * multiplier);
    } else {
      // It was a wrong answer (combo was 0)
      serverCalculatedScore = Math.max(0, serverCalculatedScore - penalty);
    }
  }

  // FINAL VALIDATION: Does the server's math match the client's score?
  if ((score !== serverCalculatedScore)) {
    return json({ 
      error: 'Score validation failed. History does not match total.',
      debug: { server: serverCalculatedScore, client: score } 
    }, { status: 400 });
  } else {
    serverCalculatedScore = Math.max(
      0,
      serverCalculatedScore - (pointsPerCorrect * 0.5)
    );
  }

  // time: preventing bots when they try to submit immediately after the game starts (before the first question is even shown)
  if (Date.now() / 1000 - decoded.iat < 2) {
    return json({ error: 'Submission too fast' }, { status: 400 });
  }

  if (!username || username.trim().length < 2) {
    return json({ error: 'Invalid username' }, { status: 400 });
  }

  if (isNaN(score) || score < 0) {
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