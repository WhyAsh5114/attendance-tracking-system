<script lang="ts">
	import TeacherView from './TeacherView.svelte';
	import StudentView from './StudentView.svelte';
	import { page } from '$app/stores';

	export let data;
</script>

{#if data.teacher}
	<TeacherView teacherClasses={data.teacher.classes} />
{:else if $page.data.session}
	<StudentView />
{:else}
	<h2>TrackMate is something something...</h2>
	<p>Login to use the app</p>
{/if}
