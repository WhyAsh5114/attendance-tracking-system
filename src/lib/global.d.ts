type Student = {
	name: string;
	email: string;
};

type TeacherClass = {
	name: string;
	semester: number;
	subjects: string[];
	students: Student[];
};
