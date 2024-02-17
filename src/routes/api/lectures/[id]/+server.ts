import clientPromise from '$lib/mongo/mongodb';
import { ObjectId } from 'mongodb';

export const GET = async ({ locals, params }) => {
	const session = await locals.auth();
	if (!session) return new Response('Not logged in', { status: 403 });

	try {
		const client = await clientPromise;
		const lecture = await client
			.db()
			.collection<Lecture>('lectures')
			.findOne({
				_id: new ObjectId(params.id)
			});
		return new Response(JSON.stringify(lecture), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
};
