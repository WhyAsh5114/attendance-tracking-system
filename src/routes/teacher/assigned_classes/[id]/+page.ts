export const load = async ({ params, fetch }) => {
	const response = await fetch(`/api/classes/${params.id}`);
	const assignedClass: WithSID<TeacherClass> = await response.json();
	return { assignedClass };
};
