import clientPromise from '$lib/mongo/mongodb.js';

export const GET = async ({ locals }) => {
	const session = await locals.auth();
	if (!session) return new Response('Not logged in', { status: 403 });

	try {
		const client = await clientPromise;
		const teachers = await client.db().collection<Teacher>('teachers').find().toArray();
		return new Response(JSON.stringify(teachers), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
};

export const POST = async ({ request, locals }) => {
	const session = await locals.auth();
	if (!session) return new Response('Not logged in', { status: 403 });

	const teacher: Teacher = await request.json();

	try {
		const client = await clientPromise;
		await client.db().collection<Teacher>('teachers').insertOne(teacher);
		return new Response('Teacher added successfully', { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
};
