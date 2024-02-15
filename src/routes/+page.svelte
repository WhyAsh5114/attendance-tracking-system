<script lang="ts">
	import TeacherView from './TeacherView.svelte';
	import StudentView from './StudentView.svelte';

	export let data;
</script>

{#if data.isTeacher}
	<TeacherView />
{:else}
	<StudentView />
{/if}
