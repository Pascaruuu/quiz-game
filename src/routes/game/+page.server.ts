import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { saveScore } from '$lib/server/db_controller'

export const load: PageServerLoad = async ({ cookies }) => {
	const savedUsername = cookies.get('username') || ''
	return { savedUsername }
}

export const actions = {
	submitScore: async ({ request }) => {
		const data = await request.formData()

		const username = data.get('username')?.toString()
		const score = Number(data.get('score'))

		if (!username || username.trim().length < 2) {
			return fail(400, { message: 'Please enter a valid username.' })
		}

		if (isNaN(score) || score < 0) {
			return fail(400, { message: 'Invalid score detected.' })
		}

		try {
			await saveScore(username, score)
		} catch (error) {
			console.error('Database Error:', error)
			return fail(500, { message: 'Could not save score to Turso.' })
		}

		throw redirect(303, '/leaderboard')
	},

	replay: async ({ request }) => {
		const data = await request.formData()

		const username = data.get('username')?.toString()
		const score = Number(data.get('score'))

		if (!username || username.trim().length < 2) {
			return fail(400, { message: 'Please enter a valid username.' })
		}

		if (isNaN(score) || score < 0) {
			return fail(400, { message: 'Invalid score detected.' })
		}

		saveScore(username, score).catch((err) => {
			console.error('Background score save failed:', err)
		})

		throw redirect(303, '/game')
	},
} satisfies Actions
