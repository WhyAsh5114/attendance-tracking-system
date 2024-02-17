import clientPromise from '$lib/mongo/mongodb.js';
import { ObjectId } from 'mongodb';

export const POST = async ({ request, locals, params }) => {
	const session = await locals.auth();
	if (!session) return new Response('Not logged in', { status: 403 });

	const markAs: boolean = await request.json();
	const lectureId = params.id;

	try {
		const client = await clientPromise;
		await client
			.db()
			.collection<Lecture>('lectures')
			.updateOne({ _id: new ObjectId(lectureId) }, { $set: { isMarkingAttendance: markAs } });
		return new Response('Attendance being marked set successfully', { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
};
