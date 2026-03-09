import { json } from '@sveltejs/kit'
import { parseAnkiDeck } from '$lib/server/ankiParser'
import type { AnkiCard } from '$lib/server/ankiParser'
import type { RequestEvent } from '@sveltejs/kit'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '$env/static/private'

function getKanji(str: string): Set<string> {
	return new Set([...str].filter((ch) => ch >= '\u4e00' && ch <= '\u9fff'))
}

function sharesKanji(a: string, b: string): boolean {
	const kanjiA = getKanji(a)
	for (const ch of getKanji(b)) {
		if (kanjiA.has(ch)) return true
	}
	return false
}

// Rough category detection from meaning keywords
function getCategory(meaning: string): string {
	const m = meaning.toLowerCase()
	if (/verb|suru|transitive|intransitive/.test(m)) return 'verb'
	if (/noun/.test(m)) return 'noun'
	if (/adjective/.test(m)) return 'adjective'
	if (/work|business|office|meeting|project|task|employee|staff|manager|client|customer/.test(m))
		return 'work'
	if (/computer|software|system|data|file|version|app|network|server|database/.test(m))
		return 'tech'
	if (/money|cost|price|pay|budget|fee|salary|amount/.test(m)) return 'finance'
	if (/time|date|schedule|deadline|period|duration/.test(m)) return 'time'
	return 'general'
}

function generateJwtToken(count: number, sessionId: string): string {
	return jwt.sign(
		{
			count,
			sessionId,
			iat: Math.floor(Date.now() / 1000), // Issued at time for expiration checks
		},
		JWT_SECRET,
		{ expiresIn: '35s' }, // 30s + 5s for buffer
	)
}

function getQuestions(selected: AnkiCard[], allCards: AnkiCard[]) {
	return selected.map((card) => {
		const cardCategory = getCategory(card.meaning)
		const cardKanji = getKanji(card.japanese)
		const hasKanji = cardKanji.size > 0

		// Score other cards by similarity
		const candidates = allCards
			.filter((c) => c.id !== card.id)
			.map((c) => {
				let score = 0
				if (hasKanji && sharesKanji(card.japanese, c.japanese)) score += 3
				if (getCategory(c.meaning) === cardCategory) score += 2
				// Add slight randomness so it's not always the same distractors
				score += Math.random()
				return { card: c, score }
			})
			.sort((a, b) => b.score - a.score)
			.slice(0, 3)
			.map((c) => c.card.japanese)

		const options = [...candidates, card.japanese].sort(() => Math.random() - 0.5)

		return {
			id: card.id,
			meaning: card.meaning,
			answer: card.japanese,
			options,
		}
	})
}

export const GET = ({ url, cookies }: RequestEvent) => {
	const limit = Number(url.searchParams.get('limit')) || 15
	const shuffle = url.searchParams.get('shuffle') !== 'false'

	const allCards = parseAnkiDeck(undefined, shuffle)
	const selected = allCards.slice(0, limit)

	const sessionId = crypto.randomUUID()

	// --- NEW: Generate JWT ---
	const gameToken = generateJwtToken(selected.length, sessionId)

	cookies.set('game_auth', gameToken, {
		path: '/', // Accessible across the site
		httpOnly: true, // Prevents JS access (XSS protection)
		secure: true, // Only sent over HTTPS (production)
		sameSite: 'strict', // Prevents CSRF
		maxAge: 35, // Match JWT expiration (in seconds)
	})

	const questions = getQuestions(selected, allCards)

	return json({ questions })
}
