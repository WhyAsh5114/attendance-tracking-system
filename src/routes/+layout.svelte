<script>
	import { signIn, signOut } from '@auth/sveltekit/client';
	import '../app.pcss';
	import MenuIcon from 'virtual:icons/material-symbols/menu';
	import { page } from '$app/stores';

	//@ts-ignore
	import { pwaInfo } from 'virtual:pwa-info';
	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

<div class="flex h-screen w-screen flex-col">
	<div class="navbar bg-base-100">
		<div class="navbar-start">
			<div class="dropdown">
				<button class="btn btn-ghost lg:hidden">
					<MenuIcon />
				</button>
				<ul
					class="menu dropdown-content menu-sm z-[1] mt-1 w-36 rounded-lg bg-secondary p-2 text-black shadow"
				>
					<li><a href="/admin">Admin</a></li>
					<li><a href="/teacher">Teacher</a></li>
					<li><a href="/student">Student</a></li>
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
				<details class="dropdown dropdown-end">
					<summary class="btn m-1">{$page.data.session?.user?.name}</summary>
					<ul
						class="menu dropdown-content z-[1] w-24 rounded-md bg-secondary p-2 text-black shadow"
					>
						<li><button on:click={() => signOut()}>Logout</button></li>
					</ul>
				</details>
			{/if}
		</div>
	</div>
	<main class="mx-auto flex h-px w-full max-w-2xl grow flex-col overflow-y-auto p-2">
		<slot />
	</main>
</div>
