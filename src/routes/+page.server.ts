import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	// Check if the cookie "username" exists
	const userName = cookies.get('username');

	return {
		hasName: !!userName, // true if userName exists, false if not
		userName: userName ?? 'Guest',
	};
};

export const actions: Actions = {
	saveName: async ({ request, cookies }) => {
		const data = await request.formData();
		const name = data.get('username') as string;

		if (name) {
			// Save the name in a cookie
			cookies.set('username', name, {
				path: '/',
				// maxAge: 60 * 60 * 24, // 1 day
				httpOnly: false, // Allows client-side access if needed
			});
		}

		return { success: true };
	},
};
