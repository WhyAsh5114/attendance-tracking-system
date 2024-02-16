<script lang="ts">
	export let data;
	$: ({ assignedClass } = data);
</script>

<h2>Teacher</h2>
<h3>Assigned class: <i>{assignedClass.name}</i></h3>
