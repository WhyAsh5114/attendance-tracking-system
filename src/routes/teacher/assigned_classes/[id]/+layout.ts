export const load = async ({ params, fetch }) => {
	let response = await fetch(`/api/classes/${params.id}`);
	const assignedClass: WithSID<TeacherClass> = await response.json();

	response = await fetch('/api/teachers');
	const teachers: WithSID<Teacher>[] = await response.json();

	response = await fetch('/api/students');
	const students: WithSID<Student>[] = await response.json();

	response = await fetch('/api/lectures');
	let lectures: WithSID<Lecture>[] = await response.json();
	lectures = lectures.filter((lecture) => assignedClass.lectures.includes(lecture._id));

	return { assignedClass, teachers, students, lectures };
};
