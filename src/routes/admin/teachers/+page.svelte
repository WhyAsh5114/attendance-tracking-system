<script lang="ts">
	import { invalidate } from '$app/navigation';
	import MyModal from '$lib/MyModal.svelte';
	export let data;

	let teacherModal: HTMLDialogElement;
	let modalTitle = '';
	let teacherName = '';
	let teacherEmail = '';

	$: ({ teachers } = data);

	async function addTeacher() {
		const teacher: Teacher = {
			name: teacherName,
			email: teacherEmail
		};
		const response = await fetch('/api/teachers', {
			method: 'POST',
			body: JSON.stringify(teacher)
		});
		await invalidate('/api/teachers');
		teacherModal.close();
	}
</script>

<h2>Admin</h2>
<h3>Teachers</h3>

<MyModal bind:dialogElement={teacherModal} title={modalTitle}>
	<form on:submit|preventDefault={addTeacher}>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Teacher name</span>
			</div>
			<input
				id="teacher-name"
				type="text"
				placeholder="Type here"
				class="input input-bordered w-full"
				required
				bind:value={teacherName}
			/>
		</label>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Teacher email</span>
			</div>
			<input
				id="teacher-email"
				type="email"
				placeholder="Type here"
				class="input input-bordered w-full"
				required
				bind:value={teacherEmail}
			/>
		</label>
		<button class="btn btn-accent btn-block mt-8">Add teacher</button>
	</form>
</MyModal>

<div class="mt-4 flex h-px grow overflow-auto">
	<table class="table h-fit">
		<thead class="bg-neutral">
			<tr>
				<th>Name & email</th>
			</tr>
		</thead>
		<tbody>
			{#each teachers as teacher}
				<tr class="bg-base-200">
					<td class="flex flex-col whitespace-nowrap">
						<span>{teacher.name}</span>
						<span class="text-sm">{teacher.email}</span>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<button
	class="btn btn-accent btn-block mt-2"
	on:click={() => {
		modalTitle = 'Add teacher';
		teacherModal.show();
	}}
>
	Add teacher
</button>
