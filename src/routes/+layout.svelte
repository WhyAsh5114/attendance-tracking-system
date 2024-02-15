<script>
	import { signIn } from '@auth/sveltekit/client';
	import '../app.pcss';
	import MenuIcon from 'virtual:icons/material-symbols/menu';
	import { page } from '$app/stores';
</script>

<div>
	<div class="navbar bg-base-100">
		<div class="navbar-start">
			<div class="dropdown">
				<button class="btn btn-ghost lg:hidden">
					<MenuIcon />
				</button>
				<ul
					class="menu dropdown-content menu-sm z-[1] mt-1 w-36 rounded-lg bg-secondary p-2 text-black shadow"
				>
					<li><a href="/">Item 1</a></li>
					<li><a href="/">Item 2</a></li>
					<li><a href="/">Item 3</a></li>
				</ul>
			</div>
			<a class="btn btn-ghost text-xl" href="/">TrackMate</a>
		</div>
		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal px-1">
				<li><a href="/">Item 1</a></li>
				<li><a href="/">Item 2</a></li>
				<li><a href="/">Item 3</a></li>
			</ul>
		</div>
		<div class="navbar-end">
			{#if !$page.data.session}
				<button class="btn" on:click={() => signIn('google')}>Sign in</button>
			{:else}
				<button class="btn">{$page.data.session?.user?.name}</button>
			{/if}
		</div>
	</div>
</div>

<slot />
