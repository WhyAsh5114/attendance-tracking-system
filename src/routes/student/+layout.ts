import { error } from '@sveltejs/kit';

export const load = async ({ fetch, parent }) => {
	const { session } = await parent();

	let response = await fetch('/api/students');
	const students = (await response.json()) as WithSID<Student>[];
	const student = students.find((s) => s.email === session?.user?.email);

	if (!student) return error(403, 'Not a student');

	response = await fetch('/api/lectures');
	let lectures = (await response.json()) as WithSID<Lecture>[];
	lectures = lectures.filter((l) => l.students.includes(student._id));

	return { student, lectures };
};
