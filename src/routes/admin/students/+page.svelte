<script lang="ts">
	import { invalidate } from '$app/navigation';
	import MyModal from '$lib/MyModal.svelte';
	export let data;

	let studentModal: HTMLDialogElement;
	let modalTitle = '';
	let studentName = '';
	let studentEmail = '';
	let studentRollNumber: number;

	$: ({ students } = data);

	async function addStudent() {
		const student: Student = {
			name: studentName,
			email: studentEmail,
			rollNumber: studentRollNumber
		};
		const response = await fetch('/api/students', {
			method: 'POST',
			body: JSON.stringify(student)
		});
		await invalidate('/api/students');
		studentModal.close();
	}
</script>

<h2>Admin</h2>
<h3>Students</h3>

<MyModal bind:dialogElement={studentModal} title={modalTitle}>
	<form on:submit|preventDefault={addStudent}>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Student name</span>
			</div>
			<input
				id="student-name"
				type="text"
				placeholder="Type here"
				class="input input-bordered w-full"
				required
				bind:value={studentName}
			/>
		</label>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Student email</span>
			</div>
			<input
				id="student-email"
				type="email"
				placeholder="Type here"
				class="input input-bordered w-full"
				required
				bind:value={studentEmail}
			/>
		</label>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Student roll number</span>
			</div>
			<input
				id="student-roll-number"
				type="number"
				placeholder="Type here"
				class="input input-bordered w-full"
				required
				bind:value={studentRollNumber}
			/>
		</label>
		<button class="btn btn-accent btn-block mt-8">Add student</button>
	</form>
</MyModal>

<div class="flex h-px grow flex-col gap-1">
	{#each students as student}
		<div class="flex">
			<span class="basis-1/5 shrink-0">{student.rollNumber}</span>
			<div class="flex flex-col">
				<span>{student.name}</span>
				<span class="text-sm">{student.email}</span>
			</div>
		</div>
	{/each}
</div>

<button
	class="btn btn-accent btn-block mt-2"
	on:click={() => {
		modalTitle = 'Add student';
		studentModal.show();
	}}
>
	Add student
</button>
