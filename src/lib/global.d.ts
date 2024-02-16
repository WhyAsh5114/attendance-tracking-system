type Student = {
	name: string;
	email: string;
	rollNumber: number;
};

type Teacher = {
	name: string;
	email: string;
};

type TeacherClass = {
	name: string;
	lectures: string[];
	assignedTeacher: string;
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

type WithSID<T> = T & { _id: string };
