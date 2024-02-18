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
	const presences = data.lecture.attendanceSheets.reduce((initialValue, sheet) => {
		const student = sheet.presentStudents.find((s) => s === data.student._id);
		return student ? initialValue + 1 : initialValue;
	}, 0);
	const attendancePercentage = ((presences / data.lecture.attendanceSheets.length) * 100).toFixed(
		2
	);
</script>

<h2>Student</h2>
<h3>Lecture {data.lecture.name}</h3>

<div class="stats bg-base-200">
	<div class="stat">
		<div class="stat-title">Attendance percentage</div>
		<div class="stat-value">
			{attendancePercentage}%
		</div>
		<div class="stat-desc">
			{#if Math.floor(parseFloat(attendancePercentage)) < 75}
				<span class="text-error">Defaulter</span>
			{:else}
				<span class="text-primary">Not defaulter</span>
			{/if}
		</div>
	</div>
</div>
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
