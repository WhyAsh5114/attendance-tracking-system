type Student = {
	name: string;
	email: string;
	rollNumber: number;
};

type Teacher = {
	name: string;
	email: string;
	assignedClass: string | null;
};

type TeacherClass = {
	name: string;
	lectures: string[];
};

type Lecture = {
	name: string;
	students: string[];
	assignedTeacher: string;
	attendanceSheets: {
		timestamp: EpochTimeStamp;
		presentStudents: string[];
	};
};
