export const load = async ({ fetch }) => {
	let response = await fetch('/api/classes');
	const classes: TeacherClass[] = await response.json();

	response = await fetch('/api/teachers');
	const teachers: WithSID<Teacher>[] = await response.json();

	return { teachers, classes };
};
