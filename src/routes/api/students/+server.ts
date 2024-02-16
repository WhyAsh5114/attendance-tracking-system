import clientPromise from '$lib/mongo/mongodb.js';

export const GET = async ({ locals }) => {
	const session = await locals.auth();
	if (!session) return new Response('Not logged in', { status: 403 });

	try {
		const client = await clientPromise;
		const students = await client.db().collection<Student>('students').find().toArray();
		return new Response(JSON.stringify(students), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
};

export const POST = async ({ request, locals }) => {
	const session = await locals.auth();
	if (!session) return new Response('Not logged in', { status: 403 });

	const student: Student = await request.json();

	try {
		const client = await clientPromise;
		await client.db().collection<Student>('students').insertOne(student);
		return new Response('Student added successfully', { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
};
