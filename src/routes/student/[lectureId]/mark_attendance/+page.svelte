<script lang="ts">
	import { onMount } from 'svelte';

	export let data;
	const isMarkingAttendance = data.lecture.isMarkingAttendance as isMarkingAttendanceObject;
	let durationLeft = Math.round((isMarkingAttendance.startTimestamp - Number(new Date())) / 100);

	let isOffline = false;

	function reduceDuration() {
		durationLeft -= 1;
		isOffline = !navigator.onLine;
		if (durationLeft > 0) {
			setTimeout(reduceDuration, 100);
		} else if (durationLeft === 0) {
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

<button class="btn btn-primary">
	Starting attendance in: {Math.round(durationLeft / 10)}
</button>
