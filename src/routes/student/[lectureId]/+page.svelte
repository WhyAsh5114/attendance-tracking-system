<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import QrScanner from 'qr-scanner';
	import { onMount } from 'svelte';
	import { cameraId } from './cameraStore';

	export let data;

	async function changeStatusToReady() {
		const response = await fetch(`/api/lectures/${data.lecture._id}/changeStudentStatus`, {
			method: 'POST',
			body: JSON.stringify({ studentId: data.student._id, status: 'ready' })
		});
		await invalidate('/api/lectures');
		if (response.ok) await goto(`/student/${data.lecture._id}/mark_attendance`);
	}

	let cameras: { id: string; label: string }[] = [];
	onMount(async () => {
		cameras = await QrScanner.listCameras();
		$cameraId = cameras[0].id;
	});
</script>

<h2>Student</h2>
<h3>Lecture {data.lecture.name}</h3>

{#if data.lecture.isMarkingAttendance !== null}
	<select id="camera-select" class="select select-bordered" bind:value={$cameraId}>
		{#each cameras as camera}
			<option value={camera.id}>{camera.label}</option>
		{/each}
	</select>
	<button class="btn btn-primary mt-2" on:click={changeStatusToReady}> Mark attendance </button>
{/if}
