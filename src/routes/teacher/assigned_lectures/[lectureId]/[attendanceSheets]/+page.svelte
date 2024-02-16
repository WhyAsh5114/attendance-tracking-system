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

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th>Roll No</th>
				<th>Name</th>
				<th>Presence</th>
			</tr>
		</thead>
		<tbody>
			{#each students as student}
				<tr>
					<td>{student.rollNumber}</td>
					<td>{student.name}</td>
					<td>{lecture.attendanceSheets}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
