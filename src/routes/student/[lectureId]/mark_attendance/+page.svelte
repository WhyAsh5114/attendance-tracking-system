<script lang="ts">
	import { onMount } from 'svelte';
	import QrScanner from 'qr-scanner';
	import { goto } from '$app/navigation';

	export let data;

	const isMarkingAttendance = data.lecture.isMarkingAttendance as isMarkingAttendanceObject;
	// let durationLeft =
	// 	Math.round((isMarkingAttendance.startTimestamp - Number(new Date())) / 100) + 50000;
	let validatedSuccessfully = false;

	let durationLeft = 60;

	let isOffline = false;
	let presentArray: (boolean | null)[] = [null, null, null, null];
	let attendanceCompleted = false;

	let qrScannerOpened = false;
	let video: HTMLVideoElement;
	let scanner: QrScanner | undefined;
	let scannedText: string = 'No QR code detected';
	async function openQrScanner() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			video.srcObject = stream;
			scanner = new QrScanner(video, (result: { data: string }) => (scannedText = result.data), {
				highlightScanRegion: true
			});

			if (scanner) {
				qrScannerOpened = true;
				const scanQRCode = () => {
					scanner?.start();
					setTimeout(() => {
						let idx = presentArray.findIndex((e) => e === null);
						presentArray[idx] =
							scannedText === isMarkingAttendance.uuidToMatch && validatedSuccessfully;
						scanner?.stop();
						scannedText = 'No QR code detected';
					}, 2000);
				};

				scanQRCode();
				const handler = setInterval(() => {
					scanQRCode();
				}, 3000);
				setTimeout(() => {
					clearInterval(handler);
					presentArray = presentArray;
					attendanceCompleted = true;
					scanner?.destroy();
				}, 12000);
			}
		} catch (error) {
			console.error('Error accessing camera:', error);
		}
	}

	function reduceDuration() {
		durationLeft -= 10;
		isOffline = !navigator.onLine;
		if (durationLeft === 0 && isOffline) {
			validatedSuccessfully = true;
			openQrScanner();
		} else if (durationLeft < 0 && !isOffline) {
			validatedSuccessfully = false;
		}
		setTimeout(reduceDuration, 1000);
	}

	onMount(reduceDuration);

	$: totalSucceeded = presentArray.filter((e) => e === true).length;
	console.log(isMarkingAttendance.uuidToMatch);

	async function syncAttendance() {
		const response = await fetch(`/api/lectures/${data.lecture._id}/markStudentPresent`, {
			method: 'POST',
			body: JSON.stringify({ studentId: data.student._id, presence: totalSucceeded >= 3 })
		});
		if (response.ok) goto('/student');
	}
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
				Starting attendance in: {Math.round(durationLeft / 10)}
			{:else}
				You ran out of time, contact lecture in-charge
			{/if}
		</button>
	{/if}

	<div class="flex flex-col items-center justify-center" class:hidden={!qrScannerOpened}>
		<div id="video-container">
			<video bind:this={video} id="qr-video" autoplay muted playsinline></video>
		</div>
		<ul class="steps mt-2 w-full">
			{#each presentArray as present}
				<li
					class="step"
					class:step-primary={present === true}
					class:step-error={present === false}
				></li>
			{/each}
		</ul>
		<span>{scannedText}</span>
	</div>
{:else}
	<div class="flex grow flex-col items-center justify-center gap-4">
		{#if isOffline}
			<span class="text-center text-5xl font-bold text-primary">You can now go online!</span>
			<span class="text-xl font-semibold">{totalSucceeded}/4 marked</span>
			<span class="text-xl">You'll be marked {totalSucceeded >= 3 ? 'present' : 'absent'}</span>
		{:else}
			<span class="text-xl">You'll be marked {totalSucceeded >= 3 ? 'present' : 'absent'}</span>
			<button class="btn btn-primary btn-block" on:click={syncAttendance}>Sync attendance</button>
		{/if}
	</div>
{/if}
