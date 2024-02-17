<script lang="ts">
	import { onMount } from 'svelte';
	import QrScanner from 'qr-scanner';
	import { goto } from '$app/navigation';
	import { cameraId } from '../cameraStore.js';

	export let data;

	const isMarkingAttendance = data.lecture.isMarkingAttendance as isMarkingAttendanceObject;
	let durationLeft = Math.round(isMarkingAttendance.startTimestamp - Number(new Date()));
	let validatedSuccessfully = false;

	let isOffline = false;
	let attendanceCompleted = false;

	let qrScannerOpened = false;
	let video: HTMLVideoElement;
	let scanner: QrScanner | undefined;
	let scannedText: string = 'No QR code detected';
	let scannedArray: string[] = [];
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
						result.data === isMarkingAttendance.uuidToMatch &&
						Number(new Date()) < isMarkingAttendance.startTimestamp + 1000 * 10
					) {
						scannedArray.push(result.data);
						scannedArray = scannedArray;
					}
				},
				{
					highlightScanRegion: true,
					maxScansPerSecond: 25
				}
			);

			await scanner.start();
			await scanner.setCamera($cameraId);

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
		const response = await fetch(`/api/lectures/${data.lecture._id}/changeStudentStatus`, {
			method: 'POST',
			body: JSON.stringify({ studentId: data.student._id, status: 'ready' })
		});
		if (response.ok) await goto('/student');
	}

	onMount(async () => {
		reduceDuration();
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
				<span class="text-lg font-semibold">Attendance begins soon</span>
			</div>
		{/if}
		<button class="btn btn-primary" disabled={!validatedSuccessfully} on:click={openQrScanner}>
			{#if !validatedSuccessfully && durationLeft > 0}
				Starting attendance in: {Math.round(durationLeft / 1000)}
			{:else}
				You ran out of time, contact lecture in-charge
			{/if}
		</button>
	{/if}

	<div class="flex flex-col items-center justify-center" class:hidden={!qrScannerOpened}>
		<div id="video-container">
			<video bind:this={video} id="qr-video" autoplay muted playsinline></video>
		</div>
		<span>{scannedText}</span>
		<progress class="progress progress-primary w-56" value={scannedArray.length} max="100"
		></progress>
	</div>
{:else}
	<div class="flex grow flex-col items-center justify-center gap-4">
		{#if isOffline}
			<span class="text-center text-3xl font-bold text-primary">You can now go online!</span>
			{#if scannedArray.length >= 50}
				<span class="text-xl text-accent">Go online to sync your attendance</span>
			{:else}
				<span class="text-xl text-error">You've been marked absent</span>
			{/if}
		{:else if scannedArray.length >= 50}
			<span class="text-xl"
				>You'll be marked {scannedArray.length >= 50 ? 'present' : 'absent'}</span
			>
			<button class="btn btn-primary btn-block" on:click={syncAttendance}>Sync attendance</button>
		{/if}
	</div>
{/if}
