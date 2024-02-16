import clientPromise from '$lib/mongo/mongodb';
import { error } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { session } = await parent();

	const client = await clientPromise;
	const admin = await client.db().collection('admins').findOne({ email: session?.user?.email });

	if (!admin) return error(403, 'Not an admin');
};
