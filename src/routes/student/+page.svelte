<script lang="ts">
	export let data;
	$: ({ student, lectures } = data);
</script>

<h2 class="text-center">Student</h2>

<div class="flex h-px grow flex-col gap-2 overflow-y-auto">
	{#each lectures as lecture}
		<a href="/student/{lecture._id}" class="btn btn-primary justify-between">
			{lecture.name}
			{#if lecture.isMarkingAttendance !== null}
				<span class="badge badge-accent">Marking attendance</span>
			{/if}
		</a>
	{/each}
</div>
