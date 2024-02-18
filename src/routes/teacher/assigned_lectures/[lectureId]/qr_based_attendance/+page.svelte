<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import QRCode from 'qrcode-generator';
	import CloseIcon from 'virtual:icons/material-symbols/close';
	export let data;

	let manualPresentStudents: string[] = [];

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

	async function finishMarkingAttendance() {
		const response = await fetch(`/api/lectures/${data.lecture._id}/convertMarkingToSheet`, {
			method: 'POST',
			body: JSON.stringify(manualPresentStudents)
		});
		await invalidate('/api/lectures');
		await goto(`/teacher/assigned_lectures/${data.lecture._id}`);
	}

	let qrCodeUUIDs: string[] = [];
	let svg = '';
	let qrClosed = false;
	let displayingQrIdx = 0;

	$: if (data.lecture.isMarkingAttendance && !qrClosed && durationLeft === 0) {
		qrCodeUUIDs = data.lecture.isMarkingAttendance.uuidToMatch;
		generateQR();
	}

	function generateQR() {
		const qr = QRCode(0, 'M');
		qr.addData(qrCodeUUIDs[displayingQrIdx]);
		qr.make();
		svg = qr.createSvgTag({ scalable: true });
		if (displayingQrIdx < 9) {
			displayingQrIdx++;
			setTimeout(generateQR, 1000);
		}
	}

	const lectureStudents = data.lecture.students.map((lectureStudent) => {
		return data.students.find((s) => lectureStudent === s._id) as WithSID<Student>;
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

	$: totalMarkedPresent = isMarkingAttendance?.studentStatuses.reduce(
		(totalPresent, studentStatus) => {
			return studentStatus.status === 'present' ? (totalPresent += 1) : totalPresent;
		},
		0
	);

	function updateManualAttendance(
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		},
		studentId: string
	) {
		if (e.currentTarget.checked) {
			manualPresentStudents.push(studentId);
		} else {
			1;
			const idx = manualPresentStudents.findIndex((e) => e === studentId);
			if (idx !== 1) {
				manualPresentStudents.splice(idx, 1);
			}
		}
	}
</script>

<h2>Teacher</h2>
<h3>QR based attendance for {data.lecture.name}</h3>

<div class="flex h-px grow overflow-auto">
	<table class="table h-fit">
		<thead>
			<tr>
				<th>Roll No</th>
				<th>Name</th>
				<th
					>Status {#if isMarkingAttendance}
						({totalMarkedPresent}/{isMarkingAttendance?.studentStatuses.length})
					{/if}</th
				>
				<th>Manual</th>
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
					<td>
						<input
							type="checkbox"
							class="checkbox"
							on:change={(e) => updateManualAttendance(e, student?._id)}
						/>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

{#if svg}
	<button
		class="btn btn-error my-2 ml-auto"
		on:click={() => {
			svg = '';
			qrClosed = true;
		}}
	>
		Close QR <CloseIcon class="h-6 w-6" />
	</button>
	<div>{@html svg}</div>
{/if}

{#if !data.lecture.isMarkingAttendance}
	<button class="btn btn-primary mt-2" on:click={startAttendance}> Start attendance </button>
{:else if durationLeft > 0}
	<span class="btn btn-primary mt-2">Attendance starts in: {Math.round(durationLeft / 10)}</span>
{:else}
	<button class="btn btn-primary mt-2" on:click={finishMarkingAttendance}>
		Finish marking attendance
	</button>
{/if}
