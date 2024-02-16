export const load = async ({ fetch }) => {
	const response = await fetch('/api/students');
	const students: Student[] = await response.json();
	
	students.sort((a, b) => a.rollNumber - b.rollNumber);
	return { students };
};
