<script lang="ts">
	export let data;
</script>

<h2>Student</h2>
<h3>Lecture {data.lecture.name}</h3>

{#if data.lecture.isMarkingAttendance !== null}
	<a class="btn btn-primary" href="/student/{data.lecture._id}/mark_attendance">Mark attendance</a>
{/if}
