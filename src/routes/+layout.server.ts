import { error } from '@sveltejs/kit';
const unprotectedRoutes = ['/'];

export const load = async ({ locals, url }) => {
	const session = await locals.auth();
	if (!session?.user?.id && !unprotectedRoutes.includes(url.pathname)) {
		error(403, 'Not logged in');
	}
	return { session };
};
