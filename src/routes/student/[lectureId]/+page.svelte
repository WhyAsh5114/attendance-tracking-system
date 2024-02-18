<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import QrScanner from 'qr-scanner';
	import { onMount } from 'svelte';

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

{#if data.lecture.isMarkingAttendance !== null}
	<button class="btn btn-primary mt-2" on:click={changeStatusToReady}> Mark attendance </button>
{/if}
