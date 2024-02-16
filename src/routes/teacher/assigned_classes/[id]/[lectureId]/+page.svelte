<script lang="ts">
	import { page } from '$app/stores';
	export let data;

	const lecture = data.lectures.find((l) => l._id === $page.params.lectureId);
</script>

<h2>Teacher</h2>
<h3>Class {data.assignedClass.name}, Lecture {lecture?.name}</h3>

{#if lecture}
  <div class="flex flex-col h-px grow overflow-y-auto">
    {#each lecture.students as _student}
      {@const student = data.students.find((s) => s._id === _student)}
      <span>{student?.name}</span>
    {/each}
  </div>
{/if}
