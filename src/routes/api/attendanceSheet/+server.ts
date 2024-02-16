import clientPromise from '$lib/mongo/mongodb';
import { ObjectId } from 'mongodb';

export const POST = async ({ request, locals }) => {
	const session = await locals.auth();
	if (!session) return new Response('Not logged in', { status: 403 });

	const { presentStudents, lectureId }: { presentStudents: string[]; lectureId: string } =
		await request.json();

	try {
		const client = await clientPromise;
		await client
			.db()
			.collection<Lecture>('lectures')
			.updateOne(
				{ _id: new ObjectId(lectureId) },
				{
					$push: {
						attendanceSheets: { presentStudents, timestamp: Number(new Date()) }
					}
				}
			);
		return new Response('Attendance sheet added successfully', { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
};
