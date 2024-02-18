<script lang="ts">
	export let data;

	const totalLectures = data.lectures.reduce((initialValue, lecture) => {
		return initialValue + lecture.attendanceSheets.length;
	}, 0);

	const totalPresentLectures = data.lectures.reduce((initialValue, lecture) => {
		const presentInThisLecture = lecture.attendanceSheets.filter((sheet) => {
			return sheet.presentStudents.includes(data.student._id);
		}).length;
		return initialValue + presentInThisLecture;
	}, 0);

	const attendancePercentage = ((totalPresentLectures / totalLectures) * 100).toFixed(2);
</script>

<h2>Student</h2>
<h3>Lectures</h3>

<div class="stats mb-4 bg-base-200">
	<div class="stat">
		<div class="stat-title">Attendance percentage</div>
		<div class="stat-value">
			{attendancePercentage}%
		</div>
		<div class="stat-desc">
			{#if Math.floor(parseFloat(attendancePercentage)) < 75}
				<span class="text-error">Defaulter</span>
			{:else}
				<span class="text-primary">Not defaulter</span>
			{/if}
		</div>
	</div>
</div>

<div class="flex h-px grow flex-col gap-2 overflow-y-auto">
	{#each data.lectures as lecture}
		<a href="/student/{lecture._id}" class="btn btn-primary justify-between">
			{lecture.name}
			{#if lecture.isMarkingAttendance !== null}
				<span class="badge badge-accent">Marking attendance</span>
			{/if}
		</a>
	{/each}
</div>
