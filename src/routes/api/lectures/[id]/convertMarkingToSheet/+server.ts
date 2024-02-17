import clientPromise from '$lib/mongo/mongodb.js';
import { ObjectId } from 'mongodb';

export const POST = async ({ locals, params }) => {
	const session = await locals.auth();
	if (!session) return new Response('Not logged in', { status: 403 });

	const lectureId = params.id;

	try {
		const client = await clientPromise;
		const lectureDocument = await client
			.db()
			.collection<Lecture>('lectures')
			.findOne({ _id: new ObjectId(lectureId) });

		if (!lectureDocument?.isMarkingAttendance)
			return new Response('Lecture not found', { status: 404 });


		const presentStudents = lectureDocument.isMarkingAttendance.studentStatuses
			.filter((studentStatus) => {
				return studentStatus.status === 'present';
			})
			.map((studentStatus) => studentStatus.studentId);

		const attendanceSheet: Lecture['attendanceSheets'][number] = {
			timestamp: lectureDocument.isMarkingAttendance.startTimestamp,
			presentStudents
		};

		await client
			.db()
			.collection<Lecture>('lectures')
			.updateOne(
				{ _id: new ObjectId(lectureId) },
				{ $push: { attendanceSheets: attendanceSheet }, $set: { isMarkingAttendance: null } }
			);
		return new Response('Attendance sheet created successfully', { status: 200 });
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify(error), { status: 500 });
	}
};
