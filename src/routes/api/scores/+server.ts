import { json } from '@sveltejs/kit';
import { saveScore } from '$lib/server/db_controller';
import type { RequestEvent } from '@sveltejs/kit';
import { GAME_CONFIG } from '$lib/gameConfig';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

// Rate limiting: 1 submission per 30s per IP
const submissions = new Map<string, number>();

export const POST = async ({ request, getClientAddress, cookies }: RequestEvent) => {
  // 1. Rate limit check
  const ip = getClientAddress();
  const last = submissions.get(ip) ?? 0;
  if (Date.now() - last <= 30000) {
    return json({ error: 'Too many submissions' }, { status: 429 });
  }
  submissions.set(ip, Date.now());

  // 2. GET THE TOKEN FROM COOKIES (Not the body!)
  const token = cookies.get('game_auth');

  const body = await request.json();
  const { username, result } = body; // Removed 'token' from here

  if (!result) return json({ error: 'Missing result data' }, { status: 400 });
  const { score, allStreaks } = result;

  // 3. JWT validation
  if (!token) return json({ error: 'No session token found in cookies' }, { status: 401 });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET) as { count: number, iat: number };
  } catch (err) {
    return json({ error: 'Invalid or expired session token' }, { status: 401 });
  }

  // 4. Anti-cheat: logic validation
  let serverCalculatedScore = 0;
  const pointsPerCorrect = GAME_CONFIG.POINTS_PER_CORRECT;
  const penalty = Math.round(pointsPerCorrect * 0.5);

  for (const comboAtStep of allStreaks) {
    if (comboAtStep > 0) {
      const multiplier = comboAtStep >= 5 ? 3 : 1 + (Math.max(0, comboAtStep - 1) * 0.5);
      serverCalculatedScore += Math.round(pointsPerCorrect * multiplier);
    } else {
      serverCalculatedScore = Math.max(0, serverCalculatedScore - penalty);
    }
  }

  // Score match check
  if (score !== serverCalculatedScore) {
    return json({ 
      error: 'Score validation failed',
      debug: { server: serverCalculatedScore, client: score } 
    }, { status: 400 });
  }

  // 5. Time check (using iat from JWT)
  if (Date.now() / 1000 - decoded.iat < 2) {
    return json({ error: 'Submission too fast' }, { status: 400 });
  }

  // 6. Basic validation & Save
  if (!username || username.trim().length < 2) return json({ error: 'Invalid username' }, { status: 400 });

  try {
    await saveScore(username, score);
    
    // Optional: Clear the cookie after successful submission 
    // so they can't submit the same session twice
    cookies.delete('game_auth', { path: '/' }); 

    return json({ success: true });
  } catch (err) {
    console.error('Score save error:', err);
    return json({ error: 'Failed to save score' }, { status: 500 });
  }
};
