<script lang="ts">
	export let data;
	$: ({ student, lectures } = data);
</script>

<h2>Student</h2>
<h3>Welcome {student.name}</h3>

<div class="flex h-px grow flex-col gap-2 overflow-y-auto">
	{#each lectures as lecture}
		<a href="/student/{lecture._id}" class="btn btn-outline btn-secondary justify-between">
			{lecture.name}
			{#if lecture.isMarkingAttendance !== null}
				<span class="badge badge-accent">Marking attendance</span>
			{/if}
		</a>
	{/each}
</div>
