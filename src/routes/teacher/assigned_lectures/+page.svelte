<script lang="ts">
	export let data;
</script>

<h2>Teacher</h2>
<h3>Assigned lectures</h3>

<div class="flex h-px grow flex-col overflow-y-auto">
	{#each data.lectures as lecture}
		{@const teacherClass = data.classes.find((c) => c.lectures.includes(lecture._id))}
		<a class="btn btn-outline btn-secondary h-fit" href="/teacher/assigned_lectures/{lecture._id}">
			<div class="flex w-full justify-between items-center">
				<span>{lecture.name}</span>
				<span class="badge badge-accent">{teacherClass?.name}</span>
			</div>
		</a>
	{/each}
</div>
