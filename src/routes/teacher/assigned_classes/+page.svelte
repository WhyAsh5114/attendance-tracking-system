<script lang="ts">
	export let data;
	$: ({ assignedClasses } = data);
</script>

<h2>Teacher</h2>
<h3>Assigned classes</h3>

{#each assignedClasses as assignedClass}
	<a class="btn btn-primary" href="/teacher/assigned_classes/{assignedClass._id}">
		{assignedClass.name}
	</a>
{/each}
