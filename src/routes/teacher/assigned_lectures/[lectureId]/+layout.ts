export const load = async ({ parent, params }) => {
	const { lectures } = await parent();
	const lecture = lectures.find((l) => l._id === params.lectureId) as WithSID<Lecture>;
	return { lecture };
};
