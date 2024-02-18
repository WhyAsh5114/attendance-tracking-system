<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	export let data;

	async function changeStatusToReady() {
		const response = await fetch(`/api/lectures/${data.lecture._id}/changeStudentStatus`, {
			method: 'POST',
			body: JSON.stringify({ studentId: data.student._id, status: 'ready' })
		});
		await invalidate('/api/lectures');
		if (response.ok) await goto(`/student/${data.lecture._id}/mark_attendance`);
	}
</script>

<h2>Student</h2>
<h3>Lecture {data.lecture.name}</h3>

<div class="mt-4 flex h-px grow overflow-auto">
	<table class="table h-fit">
		<thead class="bg-neutral">
			<tr>
				<th>Date</th>
				<th>Status</th>
			</tr>
		</thead>
		<tbody>
			{#each data.lecture.attendanceSheets as attendanceSheet}
				{@const studentPresent = attendanceSheet.presentStudents.find(
					(s) => s === data.student._id
				)}
				<tr class="bg-base-200">
					<td
						>{new Date(attendanceSheet.timestamp).toLocaleString('en-US', {
							weekday: 'short',
							year: 'numeric',
							month: 'short',
							day: 'numeric',
							hour: 'numeric',
							minute: 'numeric'
						})}</td
					>
					{#if studentPresent}
						<td class="font-semibold text-accent">Present</td>
					{:else}
						<td class="font-semibold text-error">Absent</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

{#if data.lecture.isMarkingAttendance !== null}
	<button class="btn btn-primary mt-2" on:click={changeStatusToReady}> Mark attendance </button>
{/if}
