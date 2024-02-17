<script lang="ts">
	import { goto } from '$app/navigation';

	export let data;

	async function changeStatusToReady() {
		const response = await fetch(`/api/lectures/${data.lecture._id}/changeStudentStatus`, {
			method: 'POST',
			body: JSON.stringify({ studentId: data.student._id, status: 'ready' })
		});
		if (response.ok) await goto(`/student/${data.lecture._id}/mark_attendance`);
	}
</script>

<h2>Student</h2>
<h3>Lecture {data.lecture.name}</h3>

{#if data.lecture.isMarkingAttendance !== null}
	<button class="btn btn-primary" on:click={changeStatusToReady}> Mark attendance </button>
{/if}
