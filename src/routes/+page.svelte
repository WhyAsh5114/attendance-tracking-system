<script lang="ts">
  export let data;
</script>

{#if data.isTeacher}
  <button class="btn btn-primary">Add class</button>
{/if}
