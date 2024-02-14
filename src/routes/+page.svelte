<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		if ('NDEFReader' in window) {
			const reader = new NDEFReader();

			reader.addEventListener('reading', ({ message }) => {
				for (const record of message.records) {
					console.log(record.recordType);
					console.log(record.data);
				}
			});

			reader.scan().catch((error) => {
				console.error('Error reading NFC: ', error);
			});
		} else {
			console.error('Web NFC is not supported.');
		}
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
