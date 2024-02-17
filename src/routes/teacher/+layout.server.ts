import clientPromise from '$lib/mongo/mongodb';
import { error } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { session } = await parent();
	if (!session?.user?.email) return error(403, 'No email');

	const client = await clientPromise;
	const teacher = await client
		.db()
		.collection<Teacher>('teachers')
		.findOne({ email: session?.user?.email });

	if (!teacher) return error(403, 'Not a teacher');
	return { teacher: JSON.parse(JSON.stringify(teacher)) as WithSID<Teacher> };
};
