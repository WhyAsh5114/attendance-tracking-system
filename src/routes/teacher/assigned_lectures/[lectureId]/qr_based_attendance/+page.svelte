<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	export let data;

	let callingEndpoint = false;

	async function startAttendance() {
		const response = await fetch(`/api/lectures/${$page.params.lectureId}/changeIsMarking`, {
			method: 'POST',
			body: JSON.stringify(true)
		});
		await invalidate('/api/lectures');
	}

	const lectureStudents = data.lecture.students.map((lectureStudent) => {
		return data.students.find((s) => lectureStudent === s._id);
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
				<tr class="bg-base-200">
					<td>{student?.rollNumber}</td>
					<td>{student?.name}</td>
					<td class="flex flex-wrap">
						<span class="text-error"></span>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

{#if !data.lecture.isMarkingAttendance}
	<button class="btn btn-primary mt-2" disabled={callingEndpoint} on:submit={startAttendance}>
		Start attendance
	</button>
{:else}
	<button></button>
{/if}
