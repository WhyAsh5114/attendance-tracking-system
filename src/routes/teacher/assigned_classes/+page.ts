export const load = async ({ fetch, parent }) => {
	const { teacher } = await parent();

	let response = await fetch('/api/classes');
	let assignedClasses: WithSID<TeacherClass>[] = await response.json();
	assignedClasses = assignedClasses.filter(
		(teacherClass) => teacherClass.assignedTeacher === teacher._id
	);

	return { assignedClasses };
};
