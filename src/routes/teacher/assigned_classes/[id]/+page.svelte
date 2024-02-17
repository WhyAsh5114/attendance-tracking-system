<script lang="ts">
	import { invalidate } from '$app/navigation';
	import MyModal from '$lib/MyModal.svelte';
	export let data;
	$: ({ assignedClass, teachers, students, lectures } = data);

	let lectureModal: HTMLDialogElement;
	let lectureName = '';
	let modalTitle = '';
	let teacherSearchString = '';
	let selectedTeacherId: string | undefined;
	let pageRanges = '';
	let errorModal: HTMLDialogElement;

	$: filteredTeachers = teachers.filter((teacher) =>
		teacher.name.toLowerCase().includes(teacherSearchString)
	);
	$: teacherSearchString, (selectedTeacherId = undefined);

	async function addLecture() {
		if (!selectedTeacherId) {
			errorModal.show();
			return false;
		}
		const rollNumbers = expandPageRanges(pageRanges);
		const studentsInLecture = students
			.filter((student) => rollNumbers.includes(student.rollNumber))
			.map((student) => student._id);
		const lecture: Lecture = {
			name: lectureName,
			assignedTeacher: selectedTeacherId,
			students: studentsInLecture,
			attendanceSheets: [],
			isMarkingAttendance: null
		};
		const response = await fetch('/api/lectures', {
			method: 'POST',
			body: JSON.stringify({ lecture, assignedClassId: assignedClass._id })
		});
		await invalidate('/api/lectures');
		lectureModal.close();
	}

	function expandPageRanges(pageRanges: string) {
		const ranges = pageRanges.split(',').map((range) => range.trim());
		const pages: number[] = [];
		ranges.forEach((range) => {
			if (range.includes('-')) {
				const [start, end] = range.split('-').map((page) => parseInt(page, 10));
				for (let i = start; i <= end; i++) {
					pages.push(i);
				}
			} else {
				pages.push(parseInt(range, 10));
			}
		});
		return pages.sort();
	}
</script>

<MyModal bind:dialogElement={lectureModal} title={modalTitle}>
	<form on:submit|preventDefault={addLecture}>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Lecture name</span>
			</div>
			<input
				id="class-name"
				type="text"
				placeholder="Type here"
				class="input input-bordered w-full"
				required
				bind:value={lectureName}
			/>
		</label>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Roll number ranges</span>
			</div>
			<input
				id="class-students-roll-number-ranges"
				type="string"
				placeholder="eg: 1, 2, 3-8, 11, 20-24"
				class="input input-bordered w-full"
				bind:value={pageRanges}
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

<h2>Teacher</h2>
<h3>Lectures for {assignedClass.name}</h3>

<div class="flex h-px grow flex-col">
	{#each lectures as lecture}
		{@const assignedTeacher = teachers.find((t) => t._id === lecture.assignedTeacher)}
		<a
			class="btn btn-outline btn-secondary h-fit"
			href="/teacher/assigned_classes/{assignedClass._id}/{lecture._id}"
		>
			<div class="flex w-full items-center justify-between">
				<span>{lecture.name}</span>
				<span class="badge badge-accent">{assignedTeacher?.name}</span>
			</div>
		</a>
	{/each}
</div>

<button class="btn btn-primary btn-block" on:click={() => lectureModal.show()}>Add lecture</button>
