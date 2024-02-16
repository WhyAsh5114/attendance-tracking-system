<script lang="ts">
	import { page } from '$app/stores';
	export let data;

	const lecture = data.lectures.find((l) => l._id === $page.params.lectureId) as WithSID<Lecture>;
	const students = data.students
		.filter((s) => lecture.students.includes(s._id))
		.sort((a, b) => a.rollNumber - b.rollNumber);
</script>

<h2>Teacher</h2>
<h3>Attendance sheets for {lecture.name}</h3>
