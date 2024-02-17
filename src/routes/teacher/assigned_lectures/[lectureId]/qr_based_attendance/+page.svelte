<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import QRCode from 'qrcode-generator';
	export let data;

	async function startAttendance() {
		const response = await fetch(`/api/lectures/${$page.params.lectureId}/changeIsMarking`, {
			method: 'POST',
			body: JSON.stringify(true)
		});
		await invalidate('/api/lectures');
	}

	async function updateMarkingAttendance() {
		const response = await fetch(`/api/lectures/${data.lecture._id}`);
		if (response.ok) data.lecture = await response.json();
	}

	let qrCodeData = '';
	let svg = '';

	$: if (data.lecture.isMarkingAttendance) {
		qrCodeData = data.lecture.isMarkingAttendance.uuidToMatch;
		const qr = QRCode(0, 'M');
		qr.addData(qrCodeData);
		qr.make();
		svg = qr.createSvgTag({ scalable: true });
	}

	const lectureStudents = data.lecture.students.map((lectureStudent) => {
		return data.students.find((s) => lectureStudent === s._id);
	});

	$: isMarkingAttendance = data.lecture.isMarkingAttendance;
	$: durationLeft = Math.round(
		((isMarkingAttendance?.startTimestamp ?? 0) - Number(new Date())) / 100
	);

	function reduceDuration() {
		durationLeft -= 1;
		setTimeout(reduceDuration, 100);
	}
	onMount(() => {
		reduceDuration();
		setInterval(updateMarkingAttendance, 1000);
	});
</script>

<h2>Teacher</h2>
<h3>QR based attendance</h3>

<div class="flex h-px grow overflow-auto">
	<table class="table h-fit">
		<thead>
			<tr>
				<th>Roll No</th>
				<th>Name</th>
				<th>Ready</th>
			</tr>
		</thead>
		<tbody>
			{#each lectureStudents as student}
				{@const studentStatus = isMarkingAttendance?.studentStatuses.find(
					(status) => status.studentId === student?._id
				)}
				<tr class="bg-base-200">
					<td>{student?.rollNumber}</td>
					<td>{student?.name}</td>
					<td class="flex flex-wrap font-semibold">
						{#if studentStatus?.status === 'ready'}
							<span class="text-primary">Ready</span>
						{:else if studentStatus?.status === 'present'}
							<span class="text-accent">Present</span>
						{:else}
							<span class="text-error">Not ready</span>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<div>{@html svg}</div>

{#if !data.lecture.isMarkingAttendance}
	<button class="btn btn-primary mt-2" on:click={startAttendance}> Start attendance </button>
{:else if durationLeft > 0}
	<span class="btn btn-primary mt-2">Attendance starts in: {Math.round(durationLeft / 10)}</span>
	{:else}
	<button class="btn btn-primary mt-2">Finish marking attendance</button>
{/if}
