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

<div class="mt-4 flex h-px grow overflow-auto">
	<table class="table h-fit">
		<thead class="bg-neutral">
			<tr>
				<th>Roll no</th>
				<th>Name</th>
				<th>Attendance</th>
			</tr>
		</thead>
		<tbody>
			{#each students as student}
				<tr class="bg-base-200">
					<td>{student.rollNumber}</td>
					<td> {student.name} </td>
					<td
						><input
							type="checkbox"
							id="{student.rollNumber.toString()}-present"
							class="checkbox ml-auto"
							bind:checked={student.present}
						/></td
					>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<a
	class="btn btn-primary btn-block mt-2"
	href="/teacher/assigned_lectures/{lecture._id}/attendance_sheets">See attendance sheets</a
>
<div class="join mt-2 grid grid-cols-2">
	<a
		class="btn btn-accent join-item"
		href="/teacher/assigned_lectures/{lecture._id}/qr_based_attendance"
	>
		QR attendance
	</a>
	<button class="btn btn-primary join-item" on:click={takeAttendance}>Take attendance</button>
</div>
