<script lang="ts">
	import { page } from '$app/stores';
	import { DateInput } from 'date-picker-svelte';
	import MyModal from '$lib/MyModal.svelte';
	export let data;

	let modal: HTMLDialogElement;
	const lecture = data.lectures.find((l) => l._id === $page.params.lectureId) as WithSID<Lecture>;

	const students = data.students
		.filter((s) => lecture.students.includes(s._id))
		.sort((a, b) => a.rollNumber - b.rollNumber);

	let startDate = new Date(lecture.attendanceSheets[0].timestamp);
	let endDate = new Date(lecture.attendanceSheets[lecture.attendanceSheets.length - 1].timestamp);

	$: attendanceSheets = lecture.attendanceSheets.filter((a) => {
		return Number(startDate) <= a.timestamp && a.timestamp <= Number(endDate);
	});

	let defaulterList: WithSID<Student & { isDefaulter: boolean }>[] = [];

	function generateLectureDefaulters() {
		defaulterList = students
			.map((student) => {
				let studentPresence = 0;
				attendanceSheets.forEach((attendanceSheet) => {
					if (attendanceSheet.presentStudents.includes(student._id)) {
						studentPresence++;
					}
				});
				const isDefaulter = studentPresence / attendanceSheets.length < 0.75;
				return {
					...student,
					isDefaulter
				};
			})
			.filter((student) => student.isDefaulter);

		modal.show();
	}
</script>

<h2>Teacher</h2>
<h3>Attendance sheets for {lecture.name}</h3>

<MyModal title="Defaulter List" bind:dialogElement={modal}>
	<div class="flex flex-col items-center justify-center gap-1">
		{#each defaulterList as defaulter}
			<div class="flex w-full justify-between">
				<span class="font-semibold text-error">{defaulter.name}</span>
				<span class="font-semibold">{defaulter.rollNumber}</span>
			</div>
		{/each}
	</div>
</MyModal>

<div class="flex flex-col items-start justify-center gap-1 text-sm">
	<div class="flex items-center">
		<span class="basis-20 shrink-0">Start date: </span>
		<DateInput bind:value={startDate} format="dd-MM-yy" />
	</div>
	<div class="flex items-center">
		<span class="basis-20 shrink-0">End date: </span>
		<DateInput bind:value={endDate} format="dd-MM-yy" min={startDate} />
	</div>
</div>
<div class="flex h-px grow overflow-auto mt-4">
	<table class="table h-fit">
		<thead class="bg-neutral">
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
						{#each attendanceSheets as attendanceSheet}
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

<button class="btn btn-primary btn-block mt-2" on:click={generateLectureDefaulters}
	>Generate defaulter sheet</button
>

<style>
	:root {
		--date-picker-background: #1b1e27;
		--date-picker-foreground: #f7f7f7;
	}
</style>
