<script lang="ts">
	import '@fontsource-variable/outfit';
	import '@fontsource/ubuntu-mono';

	import { onMount } from 'svelte';

	import { invalidate } from '$app/navigation';
	import '../app.css';
	import ScrollToTop from '$lib/components/ScrollToTop.svelte';
	import accountStore from '$lib/stores/accounts';
	import categoryStore from '$lib/stores/categories';
	import { Toaster } from 'svelte-french-toast';
	import { getSiteName } from '$lib/utils/env';
	import vendorStore from '$lib/stores/vendors';

	export let data;

	$: ({ supabase, session } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		const fetchData = async () => {
			await accountStore.fetchAccounts();
			await categoryStore.fetchCategories();
			await vendorStore.fetchVendors();
		};

		fetchData();

		return () => data.subscription.unsubscribe();
	});

	const siteName = getSiteName();
</script>

<svelte:head>
	<title>{siteName}</title>
</svelte:head>

<main class="grow flex flex-col">
	<div class="w-full h-full">
		<slot />
	</div>
</main>

<ScrollToTop />

<Toaster />
