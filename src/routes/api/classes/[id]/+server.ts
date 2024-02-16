import clientPromise from '$lib/mongo/mongodb.js';
import { ObjectId } from 'mongodb';

export const GET = async ({ locals, params }) => {
	const session = await locals.auth();
	if (!session) return new Response('Not logged in', { status: 403 });

	try {
		const client = await clientPromise;
		const teacherClass = await client
			.db()
			.collection<TeacherClass>('classes')
			.findOne({
				_id: new ObjectId(params.id)
			});
		return new Response(JSON.stringify(teacherClass), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
};
