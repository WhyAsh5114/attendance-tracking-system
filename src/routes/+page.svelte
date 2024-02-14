<script lang="ts">
	import { onMount } from 'svelte';

	let errorText = '';
	let data = '';
	onMount(() => {
		if ('NDEFReader' in window) {
			const reader = new NDEFReader();

			reader.addEventListener('reading', ({ message }) => {
				for (const record of message.records) {
					data = record.data;
				}
			});

			reader.scan().catch((error) => {
				errorText = 'Error reading NFC: ' + JSON.stringify(error);
			});
		} else {
			errorText = 'Web NFC is not supported.';
		}
	});
</script>

<p>Error: <span style="color: red;">{errorText}</span></p>
<p>Info: <span>{errorText}</span></p>
