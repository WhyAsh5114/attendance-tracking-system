<script lang="ts">
	export let data;
	const isMarkingAttendance = data.lecture.isMarkingAttendance as isMarkingAttendanceObject;
	$: durationLeft = isMarkingAttendance.startTimestamp - Number(new Date());

  console.log(isMarkingAttendance.startTimestamp);
</script>

<h2>Student</h2>
<h3>Marking attendance for {data.lecture.name}</h3>

<span class="m-auto text-5xl font-bold">Go offline</span>

<button class="btn btn-primary">Starting attendance in: {durationLeft}</button>
