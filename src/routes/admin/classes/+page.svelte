<script lang="ts">
	import { invalidate } from '$app/navigation';
	import MyModal from '$lib/MyModal.svelte';
	export let data;

	let errorModal: HTMLDialogElement;
	let classModal: HTMLDialogElement;
	let modalTitle = '';
	let teacherName = '';
	let teacherSearchString = '';
	let selectedTeacherId: string | undefined;

	$: ({ classes, teachers } = data);
	$: filteredTeachers = teachers.filter((teacher) =>
		teacher.name.toLowerCase().includes(teacherSearchString)
	);
	$: teacherSearchString, (selectedTeacherId = undefined);

	async function addClass() {
		if (!selectedTeacherId) {
			errorModal.show();
			return;
		}
		const teacherClass: TeacherClass = {
			name: teacherName,
			assignedTeacher: selectedTeacherId,
			lectures: []
		};
		const response = await fetch('/api/classes', {
			method: 'POST',
			body: JSON.stringify(teacherClass)
		});
		await invalidate('/api/classes');
		classModal.close();
	}
</script>

<h2>Admin</h2>
<h3>Classes</h3>

<MyModal bind:dialogElement={classModal} title={modalTitle}>
	<form on:submit|preventDefault={addClass}>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Class name</span>
			</div>
			<input
				id="class-name"
				type="text"
				placeholder="Type here"
				class="input input-bordered w-full"
				required
				bind:value={teacherName}
			/>
		</label>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Assigned teacher</span>
			</div>
			<input
				id="class-assigned-teacher"
				type="string"
				placeholder="Search"
				class="input input-bordered w-full"
				bind:value={teacherSearchString}
			/>
		</label>
		<div class="flex h-48 flex-col overflow-y-auto">
			{#each filteredTeachers as teacher}
				<div class="form-control">
					<label class="label cursor-pointer">
						<span class="text-sm">{teacher.name}</span>
						<input
							type="radio"
							name="assigned-teacher"
							class="radio"
							value={teacher._id}
							bind:group={selectedTeacherId}
							required
						/>
					</label>
				</div>
			{/each}
		</div>
		<button class="btn btn-accent btn-block mt-8">Add class</button>
	</form>
</MyModal>

<MyModal bind:dialogElement={errorModal} title="Error">
	Select a class teacher to be assigned to this class
</MyModal>

<div class="flex h-px grow flex-col gap-1">
	{#each classes as teacherClass}
		{@const classTeacher = teachers.find((t) => t._id === teacherClass.assignedTeacher)}
		<div class="flex flex-col">
			<span>{teacherClass.name}</span>
			<span class="text-sm">{classTeacher?.name}</span>
		</div>
	{/each}
</div>

<button
	class="btn btn-accent btn-block mt-2"
	on:click={() => {
		modalTitle = 'Add class';
		classModal.show();
	}}
>
	Add class
</button>
