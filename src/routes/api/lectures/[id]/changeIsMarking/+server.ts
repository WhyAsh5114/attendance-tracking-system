import clientPromise from '$lib/mongo/mongodb.js';
import { ObjectId } from 'mongodb';

export const POST = async ({ request, locals, params }) => {
	const session = await locals.auth();
	if (!session) return new Response('Not logged in', { status: 403 });

	const markAs: boolean = await request.json();
	const lectureId = params.id;

	try {
		const client = await clientPromise;
		const lectureDocument = await client
			.db()
			.collection<Lecture>('lectures')
			.findOne({ _id: new ObjectId(lectureId) });

		if (!lectureDocument) return new Response('Lecture not found', { status: 404 });

		let isMarkingAttendance: Lecture['isMarkingAttendance'] = null;
		if (markAs) {
			isMarkingAttendance = {
				studentStatuses: lectureDocument.students.map((s) => {
					return { studentId: s, status: 'not ready' };
				}),
				startTimestamp: Number(new Date()) + 1000 * 30,
				uuidToMatch: crypto.randomUUID()
			};
		}
		await client
			.db()
			.collection<Lecture>('lectures')
			.updateOne({ _id: new ObjectId(lectureId) }, { $set: { isMarkingAttendance } });
		return new Response('Attendance being marked set successfully', { status: 200 });
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify(error), { status: 500 });
	}
};
