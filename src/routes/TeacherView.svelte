<script lang="ts">
	export let teacherClasses: TeacherClass[];
	teacherClasses.sort((a, b) => {
		if (a.name < b.name) return -1;
		if (a.name > b.name) return 1;
		return 0;
	});
</script>

<h2>Teacher account</h2>
<h3>Classes</h3>

<div class="flex h-px grow flex-col gap-2 overflow-y-auto">
	{#each teacherClasses as teacherClass}
		<button class="btn h-fit p-2 btn-secondary btn-outline justify-start rounded-md">
			<div class="flex flex-col">
				<span class="text-lg font-semibold">{teacherClass.name}-{teacherClass.semester}</span>
        <div class="flex flex-wrap">
          {#each teacherClass.subjects as subject}
            <span class="badge badge-secondary">{subject}</span>
          {/each}
        </div>
			</div>
		</button>
	{/each}
</div>
<a class="btn btn-primary btn-block" href="/teachers/add_class">Add class</a>
