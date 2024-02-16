<script lang="ts">
	import TeacherView from './TeacherView.svelte';
	import StudentView from './StudentView.svelte';

	export let data;
</script>

{#if data.teacher}
	<TeacherView teacherClasses={data.teacher.classes} />
{:else}
	<StudentView />
{/if}
