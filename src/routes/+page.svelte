<script lang="ts">
	import { onMount } from 'svelte';

	let errorText = '';
	let data = '';
	onMount(async () => {
		const ndef = new NDEFReader();

		async function startScanning() {
      console.log("scanning");
			await ndef.scan();
			ndef.onreading = (event) => {
				data = JSON.stringify(event);
			};
		}

		const nfcPermissionStatus = await navigator.permissions.query({ name: 'nfc' });
		if (nfcPermissionStatus.state === 'granted') {
			// NFC access was previously granted, so we can start NFC scanning now.
			startScanning();
		} else {
			// Show a "scan" button.
			document.querySelector('#scanButton').style.display = 'block';
			document.querySelector('#scanButton').onclick = (event) => {
				// Prompt user to allow UA to send and receive info when they tap NFC devices.
				startScanning();
			};
		}
	});
</script>

<p>Error: <span style="color: red;">{errorText}</span></p>
<p>Info: <span>{data}</span></p>
<button id="scanButton">Scan</button>
