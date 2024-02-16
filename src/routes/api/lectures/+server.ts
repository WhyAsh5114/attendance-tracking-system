import clientPromise from '$lib/mongo/mongodb';
import { ObjectId } from 'mongodb';

export const GET = async ({ locals }) => {
	const session = await locals.auth();
	if (!session) return new Response('Not logged in', { status: 403 });

	try {
		const client = await clientPromise;
		const lectures = await client.db().collection<Lecture>('lectures').find().toArray();
		return new Response(JSON.stringify(lectures), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
};

export const POST = async ({ request, locals }) => {
	const session = await locals.auth();
	if (!session) return new Response('Not logged in', { status: 403 });

	const { lecture, assignedClassId }: { lecture: Lecture; assignedClassId: string } =
		await request.json();

	try {
		const client = await clientPromise;
		const insertResult = await client.db().collection<Lecture>('lectures').insertOne(lecture);
		await client
			.db()
			.collection<TeacherClass>('classes')
			.updateOne(
				{ _id: new ObjectId(assignedClassId) },
				{ $push: { lectures: insertResult.insertedId.toString() } }
			);
		return new Response('Lecture added successfully', { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
};
