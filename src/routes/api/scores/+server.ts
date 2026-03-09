import { json } from '@sveltejs/kit'
import { saveScore } from '$lib/server/db_controller'
import type { RequestEvent } from '@sveltejs/kit'
import { GAME_CONFIG } from '$lib/gameConfig'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '$env/static/private'

type ScoreSubmission = {
	count: number
	iat: number
}

type QuizResult = {
	score: number
	allStreaks: number[]
}

// Rate limiting: 1 submission per 30s per IP
const submissions = new Map<string, number>()

function isRateLimited(ip: string): boolean {
	const last = submissions.get(ip) ?? 0
	return Date.now() - last <= GAME_CONFIG.RATE_LIMIT_MS
}

function parseSessionToken(token?: string): ScoreSubmission | null {
	if (!token) return null

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as ScoreSubmission
		return decoded
	} catch {
		return null
	}
}

function isValidResult(result: unknown): result is QuizResult {
	if (!result || typeof result !== 'object') return false

	const maybe = result as Partial<QuizResult>
	return (
		typeof maybe.score === 'number' &&
		Array.isArray(maybe.allStreaks) &&
		maybe.allStreaks.every((n) => typeof n === 'number')
	)
}

function calculateServerScore(allStreaks: number[]): number {
	let total = 0
	const pointsPerCorrect = GAME_CONFIG.POINTS_PER_CORRECT
	const penalty = Math.round(pointsPerCorrect * 0.5)

	for (const comboAtStep of allStreaks) {
		if (comboAtStep > 0) {
			const multiplier = comboAtStep >= 5 ? 3 : 1 + Math.max(0, comboAtStep - 1) * 0.5
			total += Math.round(pointsPerCorrect * multiplier)
		} else {
			total = Math.max(0, total - penalty)
		}
	}

	return total
}

function isValidUsername(username: unknown): username is string {
	return typeof username === 'string' && username.trim().length >= GAME_CONFIG.MIN_USERNAME_LENGTH
}

// Main handler for score submission
export const POST = async ({ request, getClientAddress, cookies }: RequestEvent) => {
	if (isRateLimited(getClientAddress())) {
		return json({ error: 'Too many submissions' }, { status: 429 })
	}

	const body = await request.json()
	const username = body?.username
	const result = body?.result

	if (!isValidResult(result)) {
		return json({ error: 'Missing or invalid result data' }, { status: 400 })
	}

	const token = cookies.get('game_auth')
	const session = parseSessionToken(token)
	if (!session) {
		return json({ error: 'Invalid or expired session token' }, { status: 401 })
	}

	const serverCalculatedScore = calculateServerScore(result.allStreaks)
	if (result.score !== serverCalculatedScore) {
		return json(
			{
				error: 'Score validation failed',
				debug: { server: serverCalculatedScore, client: result.score },
			},
			{ status: 400 },
		)
	}

	const sessionAgeSeconds = Date.now() / 1000 - session.iat
	if (sessionAgeSeconds < GAME_CONFIG.MIN_SESSION_AGE_SECONDS) {
		return json({ error: 'Submission too fast' }, { status: 400 })
	}

	if (!isValidUsername(username)) {
		return json({ error: 'Invalid username' }, { status: 400 })
	}

	try {
		await saveScore(username, result.score)
		cookies.delete('game_auth', { path: '/' })
		return json({ success: true })
	} catch (err) {
		console.error('Score save error:', err)
		return json({ error: 'Failed to save score' }, { status: 500 })
	}
}
