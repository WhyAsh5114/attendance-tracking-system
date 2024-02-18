import clientPromise from '$lib/mongo/mongodb.js';
import { ObjectId } from 'mongodb';

export const POST = async ({ request, locals, params }) => {
	const session = await locals.auth();
	if (!session) return new Response('Not logged in', { status: 403 });

	const { studentId, status }: { studentId: string; status: 'ready' | 'not ready' | 'present' } =
		await request.json();
	const lectureId = params.id;

	try {
		const client = await clientPromise;
		const lectureDocument = await client
			.db()
			.collection<Lecture>('lectures')
			.findOne({ _id: new ObjectId(lectureId) });

		if (!lectureDocument?.isMarkingAttendance)
			return new Response('Lecture not found', { status: 404 });

		const statusDocument = lectureDocument.isMarkingAttendance.studentStatuses.find(
			(status) => status.studentId === studentId
		) as {
			studentId: string;
			status: 'not ready' | 'ready' | 'present';
		};
		statusDocument.status = status;

		await client
			.db()
			.collection<Lecture>('lectures')
			.replaceOne({ _id: new ObjectId(lectureId) }, lectureDocument);
		return new Response('Attendance marked successfully', { status: 200 });
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify(error), { status: 500 });
	}
};
