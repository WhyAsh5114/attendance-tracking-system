<script lang="ts">
	import { page } from '$app/stores';
	import MyModal from '$lib/MyModal.svelte';
	export let data;

	let modal: HTMLDialogElement;
	let modalTitle = '';
	let modalText = '';

	const lecture = data.lectures.find((l) => l._id === $page.params.lectureId) as WithSID<Lecture>;
	const students = lecture.students
		.map((s) => {
			return { ...(data.students.find((_s) => _s._id === s) as WithSID<Student>), present: false };
		})
		.sort((a, b) => a.rollNumber - b.rollNumber);

	async function takeAttendance() {
		const presentStudents = students.filter((s) => s.present).map((s) => s._id);
		const response = await fetch('/api/attendanceSheet', {
			method: 'POST',
			body: JSON.stringify({ presentStudents, lectureId: lecture._id })
		});
		modalTitle = response.ok ? 'Success' : 'Error';
		modalText = await response.text();
		modal.show();
	}
</script>

<h2>Teacher</h2>
<h3>Assigned lecture {lecture?.name}</h3>

<MyModal title={modalTitle} bind:dialogElement={modal}>
	{modalText}
</MyModal>

{#if lecture}
	<div class="flex h-px grow flex-col gap-1 overflow-y-auto">
		{#each students as student}
			<div class="flex items-end gap-1">
				<span class="mr-2 text-sm">{student.rollNumber}</span>
				<span>{student.name}</span>
				<input
					type="checkbox"
					id="{student.rollNumber.toString()}-present"
					class="checkbox ml-auto"
					bind:checked={student.present}
				/>
			</div>
		{/each}
	</div>
{/if}

<a class="btn btn-primary btn-block" href="/teacher/assigned_lectures/{lecture._id}/attendance_sheets">See attendance sheets</a>
<button class="btn btn-primary btn-block mt-2" on:click={takeAttendance}>Take attendance</button>
