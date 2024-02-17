<script lang="ts">
	export let data;
	const isMarkingAttendance = data.lecture.isMarkingAttendance as isMarkingAttendanceObject;
	const durationLeft = isMarkingAttendance.startTimestamp - Number(new Date());
</script>

<h2>Student</h2>
<h3>Marking attendance for {data.lecture.name}</h3>

<span class="m-auto text-5xl font-bold">Go offline</span>

<button class="btn btn-primary">
	Starting attendance in: <span class="countdown">
		<span style="--value:{(durationLeft / 1000).toFixed(0)};"></span>
	</span>
</button>
