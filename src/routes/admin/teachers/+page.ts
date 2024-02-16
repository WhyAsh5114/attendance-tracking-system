export const load = async ({ fetch }) => {
	const response = await fetch('/api/teachers');
	const teachers: Teacher[] = await response.json();

	return { teachers };
};
