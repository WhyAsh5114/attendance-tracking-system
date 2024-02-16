import clientPromise from '$lib/mongo/mongodb';
import { error } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { session } = await parent();

	const client = await clientPromise;
	const teacher = await client.db().collection('teachers').findOne({ email: session?.user?.email });

	if (!teacher) return error(403, 'Not a teacher');
};
