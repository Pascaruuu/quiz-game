// import { fileURLToPath } from 'node:url';
import rawDeck from './data/n3vocab.txt?raw'

export interface AnkiCard {
	id: number
	japanese: string
	meaning: string
}

function parseTsvLine(line: string): string[] {
	const fields: string[] = []
	let current = ''
	let inQuotes = false

	for (let i = 0; i < line.length; i++) {
		const ch = line[i]
		if (ch === '"') {
			if (inQuotes && line[i + 1] === '"') {
				current += '"'
				i++
			} else {
				inQuotes = !inQuotes
			}
		} else if (ch === '\t' && !inQuotes) {
			fields.push(current)
			current = ''
		} else {
			current += ch
		}
	}
	fields.push(current)
	return fields
}

function extractMeaning(html: string): string {
	const glossaryMatch = html.match(/data-sc-content="glossary">(.*?)<\/ul>/s)
	if (!glossaryMatch) return ''

	const liMatches = glossaryMatch[1].matchAll(/<li>(.*?)<\/li>/gs)
	const meanings: string[] = []
	for (const match of liMatches) {
		const text = match[1].replace(/<[^>]+>/g, '').trim()
		if (text) meanings.push(text)
		if (meanings.length >= 3) break
	}
	return meanings.join('; ')
}

export function parseAnkiDeck(limit?: number, randomize: boolean = false): AnkiCard[] {
	const lines = rawDeck.split('\n').filter((line) => !line.startsWith('#') && line.trim())

	let id = 1
	const cards: AnkiCard[] = lines
		.map((line) => {
			const fields = parseTsvLine(line)
			const japanese = fields[0]?.trim() ?? ''
			const meaningHtml = fields[2]?.trim() ?? ''
			const meaning = extractMeaning(meaningHtml)

			if (!japanese || !meaning) return null
			return { id: id++, japanese, meaning }
		})
		.filter((c): c is AnkiCard => c !== null)

	if (randomize) cards.sort(() => Math.random() - 0.5)
	return limit ? cards.slice(0, limit) : cards
}
