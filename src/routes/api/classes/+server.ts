import clientPromise from '$lib/mongo/mongodb.js';

export const POST = async ({ locals, request }) => {
	const session = await locals.auth();
	if (!session) return new Response('Not logged in', { status: 403 });

	const teacherClass: TeacherClass = await request.json();
	const client = await clientPromise;
	try {
		await client
			.db()
			.collection('teachers')
			.updateOne(
				{
					emailId: session.user?.email
				},
				{
					$push: { classes: teacherClass }
				}
			);

		return new Response('Class added successfully', { status: 200 });
	} catch (error) {
		return new Response('Internal server error', { status: 500 });
	}
};
