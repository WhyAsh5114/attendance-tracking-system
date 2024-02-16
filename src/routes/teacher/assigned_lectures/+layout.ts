export const load = async ({ fetch, parent }) => {
	const { teacher } = await parent();

	let response = await fetch('/api/students');
	const students: WithSID<Student>[] = await response.json();

	response = await fetch('/api/lectures');
	let lectures: WithSID<Lecture>[] = await response.json();
	lectures = lectures.filter((lecture) => lecture.assignedTeacher === teacher._id);

	response = await fetch('/api/classes');
	let classes: WithSID<TeacherClass>[] = await response.json();

	return { students, lectures, classes };
};
