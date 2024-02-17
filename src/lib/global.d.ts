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
	isMarkingAttendance: null | {
		studentStatuses: { studentId: string; status: 'not ready' | 'ready' | 'present' }[];
		startTimestamp: EpochTimeStamp;
		uuidToMatch: string;
	};
	attendanceSheets: {
		timestamp: EpochTimeStamp;
		presentStudents: string[];
	}[];
};

type WithSID<T> = T & { _id: string };
