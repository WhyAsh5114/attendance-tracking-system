<script lang="ts">
	import RemoveIcon from 'virtual:icons/material-symbols/delete';
	import MyModal from '$lib/MyModal.svelte';
	import { invalidate, goto } from '$app/navigation';

	let subjectName = '';
	let subjects: string[] = [];
	let className = '';
	let semester: undefined | number = undefined;
	let studentName = '';
	let studentEmail = '';
	let students: Student[] = [];

	let modal: HTMLDialogElement;
	let modalTitle = '';
	let modalText = '';
	let modalOnClose = () => {};
	let callingEndpoint = false;

	function addSubject() {
		subjects = [...subjects, subjectName];
		subjectName = '';
	}

	function removeSubject(subject: string) {
		let idx = subjects.indexOf(subject);
		subjects.splice(idx, 1);
		subjects = subjects;
	}

	function addStudent() {
		const student: Student = {
			name: studentName,
			email: studentEmail
		};
		students = [...students, student];
	}

	async function submitClass() {
		callingEndpoint = true;
		modalOnClose = () => {};
		const teacherClass: TeacherClass = {
			name: className,
			semester: semester as number,
			students,
			subjects
		};
		const response = await fetch('/api/classes', {
			method: 'POST',
			body: JSON.stringify(teacherClass),
			headers: { 'content-type': 'application/json' }
		});
		modalTitle = response.ok ? 'Success' : 'Error';
		modalText = await response.text();
		if (response.ok) modalOnClose = invalidateAndRedirect;
		modal.show();
		callingEndpoint = false;
	}

	async function invalidateAndRedirect() {
		await invalidate('/api/classes');
		await goto('/');
	}
</script>

<MyModal bind:dialogElement={modal} title={modalTitle} {modalOnClose}>
	{modalText}
</MyModal>

<h2>Add class</h2>
<form id="class-form" class="my-auto" on:submit|preventDefault={submitClass}>
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Class name</span>
		</div>
		<select id="class-name" class="select select-bordered w-full" required bind:value={className}>
			<option disabled selected value="">Select a class</option>
			<option>AN</option>
			<option>TE</option>
			<option>ME</option>
			<option>CE</option>
			<option>AE</option>
		</select>
	</label>

	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Semester</span>
		</div>
		<select id="semester" class="select select-bordered w-full" required bind:value={semester}>
			<option disabled selected value={undefined}>Select a semester</option>
			<option value={1}>1</option>
			<option value={2}>2</option>
			<option value={3}>3</option>
			<option value={4}>4</option>
			<option value={5}>5</option>
			<option value={6}>6</option>
		</select>
	</label>

	<form id="subject-form" on:submit|preventDefault={addSubject}>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Add subjects</span>
			</div>
			<div class="join">
				<input
					type="text"
					id="subject-name"
					placeholder="Type here"
					class="input join-item input-bordered w-full"
					bind:value={subjectName}
					required
				/>
				<button class="btn btn-secondary join-item">ADD</button>
			</div>
		</label>
	</form>
	<div class="mt-2 flex flex-wrap gap-1">
		{#each subjects as subject}
			<button
				class="badge badge-accent badge-lg flex gap-1 font-semibold"
				on:click={() => removeSubject(subject)}
			>
				<RemoveIcon />
				{subject}
			</button>
		{/each}
	</div>

	<div class="divider">Add students</div>

	<form id="student-form" on:submit|preventDefault={addStudent}>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Student name</span>
			</div>
			<input
				type="text"
				id="student-name"
				placeholder="Type here"
				class="input join-item input-bordered w-full"
				required
				bind:value={studentName}
			/>
		</label>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Student email</span>
			</div>
			<input
				type="email"
				id="student-email"
				placeholder="Type here"
				class="input join-item input-bordered w-full"
				required
				bind:value={studentEmail}
			/>
		</label>
		<button class="btn btn-secondary btn-block mt-4">Add student</button>
	</form>

	<!-- TODO: add table for students -->
</form>

<button
	class="btn btn-primary btn-block mt-2"
	type="submit"
	form="class-form"
	disabled={callingEndpoint}
>
	{#if callingEndpoint}
		Creating class <span class="loading loading-spinner"></span>
	{:else}
		Create class
	{/if}
</button>
