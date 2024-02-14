<script lang="ts">
	import { onMount } from 'svelte';

	let errorText = '';
	let data = '';
	onMount(() => {
		const ndef = new NDEFReader();
		ndef
			.scan()
			.then(() => {
				data = 'Scan started successfully.';
				ndef.onreadingerror = () => {
					data = 'Cannot read data from the NFC tag. Try another one?';
				};
				ndef.onreading = (event) => {
					data = `NDEF message read. ${event}`;
				};
			})
			.catch((error) => {
				error = `Error! Scan failed to start: ${error}.`;
			});
	});
</script>

<p>Error: <span style="color: red;">{errorText}</span></p>
<p>Info: <span>{errorText}</span></p>
