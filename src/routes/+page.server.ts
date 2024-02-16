import clientPromise from '$lib/mongo/mongodb.js';

export const load = async ({ parent }) => {
	const { session } = await parent();

	const client = await clientPromise;
	const teacher = await client
		.db()
		.collection('teachers')
		.findOne({ emailId: session?.user?.email });

	return { teacher: JSON.parse(JSON.stringify(teacher)) };
};
