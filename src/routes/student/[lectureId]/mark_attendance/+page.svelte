<script lang="ts">
	import { onMount } from 'svelte';
	import QrScanner from 'qr-scanner';

	export let data;
	const isMarkingAttendance = data.lecture.isMarkingAttendance as isMarkingAttendanceObject;
	let durationLeft =
		Math.round((isMarkingAttendance.startTimestamp - Number(new Date())) / 100) - 4500;
	let validatedSuccessfully = false;

	let isOffline = false;
	let presentArray: (boolean | null)[] = [null, null, null, null];

	let video: HTMLVideoElement;
	let scanner: QrScanner | undefined;
	let scannedText: string = 'No QR code detected';
	async function openQrScanner() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			video.srcObject = stream;
			scanner = new QrScanner(
				video,
				(result: { data: string }) => (scannedText = result.data.slice(7)),
				{ highlightScanRegion: true }
			);

			if (scanner) {
				const scanQRCode = () => {
					scanner?.start();
					setTimeout(() => {
						let idx = presentArray.findIndex((e) => e === null);
						presentArray[idx] = scannedText === isMarkingAttendance.uuidToMatch;
						scanner?.stop();
						scannedText = 'No QR code detected';
					}, 2000);
				};

				scanQRCode();
				const handler = setInterval(() => {
					scanQRCode();
				}, 3000);
				setTimeout(() => clearInterval(handler), 12000);
			}
		} catch (error) {
			console.error('Error accessing camera:', error);
		}
	}

	function reduceDuration() {
		if (durationLeft > 0) {
			durationLeft -= 10;
		}
		isOffline = !navigator.onLine;
		if (durationLeft === 0 && isOffline) {
			validatedSuccessfully = true;
		} else if (durationLeft < 0) {
			validatedSuccessfully = false;
		}
		setTimeout(reduceDuration, 1000);
	}

	// TODO: remove comment onMount(reduceDuration);
	onMount(openQrScanner);
</script>

<h2>Student</h2>
<h3>Marking attendance for {data.lecture.name}</h3>

{#if !isOffline}
	<span class="m-auto text-5xl font-bold text-error">Go offline</span>
{:else}
	<div class="flex grow flex-col items-center justify-center">
		<span class="text-5xl font-bold text-primary">You're offline!</span>
		<span class="text-lg font-semibold">Attendance begins soon</span>
	</div>
{/if}

{#if !scanner}
	<button class="btn btn-primary" disabled={!validatedSuccessfully} on:click={openQrScanner}>
		{#if !validatedSuccessfully}
			Starting attendance in: {Math.round(durationLeft / 10)}
		{:else}
			You ran out of time, contact lecture in-charge
		{/if}
	</button>
{/if}

<div id="video-container">
	<video bind:this={video} id="qr-video" autoplay muted playsinline></video>
</div>
<ul class="steps mt-2">
	{#each presentArray as present}
		<li
			class="step"
			class:step-primary={present === true}
			class:step-error={present === false}
		></li>
	{/each}
</ul>
<span>{scannedText}</span>
