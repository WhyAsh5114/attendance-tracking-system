<script lang="ts">
	import { page } from '$app/stores';
	import { DateInput } from 'date-picker-svelte';
	export let data;

	const lecture = data.lectures.find((l) => l._id === $page.params.lectureId) as WithSID<Lecture>;
	const students = data.students
		.filter((s) => lecture.students.includes(s._id))
		.sort((a, b) => a.rollNumber - b.rollNumber);

	let startDate = new Date();
	let endDate = new Date();
</script>

<h2>Teacher</h2>
<h3>Attendance sheets for {lecture.name}</h3>

<div class="flex items-center gap-1 text-sm">
	<span>Start date: </span>
	<DateInput bind:value={startDate} format="dd-MM-yy" class="mr-auto"/>
	<span>End date: </span>
	<DateInput bind:value={endDate} format="dd-MM-yy" min={startDate}  dynamicPositioning/>
</div>
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
				<tr class="bg-base-200">
					<td>{student.rollNumber}</td>
					<td>{student.name}</td>
					<td class="flex flex-wrap">
						{#each lecture.attendanceSheets as attendanceSheet}
							{#if attendanceSheet.presentStudents.includes(student._id)}
								<span class="text-accent">P</span>
							{:else}
								<span class="text-error">A</span>
							{/if}
						{/each}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	:root {
		--date-picker-background: #1b1e27;
		--date-picker-foreground: #f7f7f7;
	}
</style>
