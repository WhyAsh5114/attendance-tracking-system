<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import QrScanner from 'qr-scanner'; 

	export let data;
	const isMarkingAttendance = data.lecture.isMarkingAttendance as isMarkingAttendanceObject;
	let durationLeft = Math.round((isMarkingAttendance.startTimestamp - Number(new Date())) / 100);
	let buttonDisabled = true;

	let isOffline = false;

	let video: HTMLVideoElement;
	let scanner: QrScanner | undefined;
	let scannedText: string = 'None';
	function openQrScanner() {
		onMount(async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ video: true });
				video.srcObject = stream;

				const scannerOptions = {};

				scanner = new QrScanner(
					video,
					(result: any) => {
						scannedText = result.data;
					},
					scannerOptions
				);

				if (scanner) {
					const scanQRCode = () => {
						scanner?.start();
						setTimeout(() => {
							scanner?.stop();
							if (scannedText === 'None') {
								scannedText = 'No QR code detected';
							}
						}, 2000);
					};

					scanQRCode();

					setInterval(() => {
						scanQRCode();
					}, 10000);
				}
			} catch (error) {
				console.error('Error accessing camera:', error);
			}
		});

		onDestroy(() => {
			if (scanner) {
				scanner.stop();
			}
		});
	}

	function reduceDuration() {
		if (durationLeft > 0) {
			durationLeft -= 1;
		}
		isOffline = !navigator.onLine;
		if (durationLeft === 0 && isOffline) {
			buttonDisabled = false;
			openQrScanner();
		} else {
			buttonDisabled = true;
		}
	}
	onMount(reduceDuration);
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

<button class="btn btn-primary" disabled={buttonDisabled}>
	Starting attendance in: {Math.round(durationLeft / 10)}
</button>

<div id="video-container">
	<video bind:this={video} id="qr-video" autoplay muted playsinline></video>
</div>
