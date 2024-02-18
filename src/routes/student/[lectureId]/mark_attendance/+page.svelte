<script lang="ts">
	import { onMount } from 'svelte';
	import QrScanner from 'qr-scanner';
	import { goto } from '$app/navigation';

	export let data;

	const isMarkingAttendance = data.lecture.isMarkingAttendance as isMarkingAttendanceObject;
	let durationLeft = Math.round(isMarkingAttendance.startTimestamp - Number(new Date())) - 5000;
	let validatedSuccessfully = false;

	let isOffline = false;
	let attendanceCompleted = false;
	let callingEndpoint = false;

	let qrScannerOpened = false;
	let video: HTMLVideoElement;
	let scanner: QrScanner | undefined;
	let scannedText: string = 'No QR code detected';
	let scannedArray: Set<string> = new Set();
	async function openQrScanner() {
		try {
			qrScannerOpened = true;
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			video.srcObject = stream;

			scanner = new QrScanner(
				video,
				(result: { data: string }) => {
					scannedText = result.data;
					if (
						isMarkingAttendance.uuidToMatch.includes(result.data) &&
						Number(new Date()) < isMarkingAttendance.startTimestamp + 1000 * 10
					) {
						scannedArray.add(result.data);
						scannedArray = scannedArray;
					}
				},
				{
					highlightScanRegion: true,
					maxScansPerSecond: 25
				}
			);

			await scanner.start();
			await scanner.setCamera(selectedCameraId);

			setTimeout(() => {
				scanner?.destroy();
				attendanceCompleted = true;
			}, 10000);
		} catch (error) {
			console.error('Error accessing camera:', error);
		}
	}

	function reduceDuration() {
		durationLeft -= 100;
		isOffline = !navigator.onLine;
		if (Math.floor(durationLeft / 100) === 0 && isOffline) {
			validatedSuccessfully = true;
			openQrScanner();
		} else if (durationLeft < 0 && !isOffline) {
			validatedSuccessfully = false;
		}
		setTimeout(reduceDuration, 100);
	}

	async function syncAttendance() {
		callingEndpoint = true;
		const response = await fetch(`/api/lectures/${data.lecture._id}/changeStudentStatus`, {
			method: 'POST',
			body: JSON.stringify({ studentId: data.student._id, status: 'present' })
		});
		if (response.ok) await goto('/student');
		callingEndpoint = false;
	}

	let cameras: { id: string; label: string }[] = [];
	let selectedCameraId: string;

	onMount(async () => {
		reduceDuration();
		cameras = await QrScanner.listCameras(true);
		selectedCameraId = cameras[0].id;
	});
</script>

<h2>Student</h2>
<h3>Marking attendance for {data.lecture.name}</h3>

{#if !attendanceCompleted}
	{#if !scanner}
		{#if !isOffline}
			<span class="m-auto text-5xl font-bold text-error">Go offline</span>
		{:else}
			<div class="flex grow flex-col items-center justify-center">
				<span class="text-5xl font-bold text-primary">You're offline!</span>
				<span class="text-lg font-semibold">
					{#if durationLeft > 0}
						Attendance begins soon
					{:else}
						You missed the deadline, contact lecturer
					{/if}
				</span>
			</div>
		{/if}
		<select id="camera-select" class="select select-bordered" bind:value={selectedCameraId}>
			{#each cameras as camera}
				<option value={camera.id}>{camera.label}</option>
			{/each}
		</select>
		<button class="btn btn-primary mt-2" disabled={!validatedSuccessfully} on:click={openQrScanner}>
			{#if !validatedSuccessfully && durationLeft > 0}
				Starting attendance in: {Math.round(durationLeft / 1000)}
			{:else}
				Deadline missed
			{/if}
		</button>
	{/if}

	<div class="flex flex-col items-center justify-center" class:hidden={!qrScannerOpened}>
		<div id="video-container">
			<video bind:this={video} id="qr-video" autoplay muted playsinline></video>
		</div>
		<progress
			class="progress progress-primary mx-2 mt-2 w-full"
			value={scannedArray.size}
			max="10"
		></progress>
	</div>
{:else}
	<div class="flex grow flex-col items-center justify-center gap-4">
		{#if isOffline}
			<span class="text-center text-3xl font-bold text-primary">You can now go online!</span>
			{#if scannedArray.size >= 8}
				<span class="text-xl text-accent">Go online to add your attendance</span>
			{:else}
				<span class="text-xl text-error">You've been marked absent</span>
			{/if}
		{:else if scannedArray.size >= 8}
			<span class="text-xl"
				>You'll be marked {scannedArray.size >= 8 ? 'present' : 'absent'}</span
			>
			<button
				class="btn btn-primary btn-block"
				on:click={syncAttendance}
				disabled={callingEndpoint}
			>
				{#if !callingEndpoint}
					Sync attendance
				{:else}
					<span class="loading loading-spinner"></span>
				{/if}
			</button>
		{/if}
	</div>
{/if}
