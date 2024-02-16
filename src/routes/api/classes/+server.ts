import clientPromise from '$lib/mongo/mongodb.js';

export const GET = async ({ locals }) => {
	const session = await locals.auth();
	if (!session) return new Response('Not logged in', { status: 403 });

	try {
		const client = await clientPromise;
		const classes = await client.db().collection<TeacherClass>('classes').find().toArray();
		return new Response(JSON.stringify(classes), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
};

export const POST = async ({ request, locals }) => {
	const session = await locals.auth();
	if (!session) return new Response('Not logged in', { status: 403 });

	const teacherClass: TeacherClass = await request.json();

	try {
		const client = await clientPromise;
		await client.db().collection<TeacherClass>('classes').insertOne(teacherClass);
		return new Response('Class added successfully', { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
};
