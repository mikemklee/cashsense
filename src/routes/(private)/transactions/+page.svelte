<script lang="ts">
	import { format as dateFormat, startOfMonth } from 'date-fns';
	import { onDestroy } from 'svelte';

	import Button from '$lib/components/Button.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import DateInput from '$lib/components/inputs/DateInput.svelte';
	import SearchInput from '$lib/components/inputs/SearchInput.svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import accountStore from '$lib/stores/accounts';
	import categoryStore from '$lib/stores/categories';
	import transactionStore from '$lib/stores/transactions';
	import type { Account, Category, LiftedTransaction } from '$lib/types';
	import { TRANSACTION_TABLE_COLUMNS } from '$lib/utils/table';
	import AccountsFilter from './AccountsFilter.svelte';
	import CategoriesFilter from './CategoriesFilter.svelte';
	import NewTransactionPanel from './NewTransactionPanel.svelte';
	import TransactionDetails from './TransactionDetails.svelte';
	import TransactionInsights from './TransactionInsights.svelte';

	let transactions: LiftedTransaction[] = [];
	let selectedStartDate: Date | null = startOfMonth(new Date());
	let selectedEndDate: Date | null = new Date();
	let searchValue = '';
	let timer: NodeJS.Timeout;

	const debounce = (value: string) => {
		clearTimeout(timer);
		timer = setTimeout(async () => {
			searchValue = value;
			await fetchTransactions();
		}, 750);
	};

	function handleSearchInput(event: Event) {
		const target = event.target as HTMLInputElement;
		debounce(target.value);
	}

	let showNewRecordPanel = false;
	let selectedTransaction: LiftedTransaction | null = null;

	$: formattedStartDate = selectedStartDate ? dateFormat(selectedStartDate, 'yyyy-MM-dd') : '';
	$: formattedEndDate = selectedEndDate ? dateFormat(selectedEndDate, 'yyyy-MM-dd') : '';

	async function fetchTransactions() {
		await transactionStore.fetchTransactions(formattedStartDate, formattedEndDate, searchValue);
	}

	function onSelectTransaction(transaction: LiftedTransaction | null) {
		selectedTransaction = transaction;
	}

	function onDeselectTransaction() {
		selectedTransaction = null;
	}

	let accounts: Account[] = [];
	let selectedAccounts: string[] = [];

	async function onSelectAccountFilterItem(accountId: string) {
		if (selectedAccounts.includes(accountId)) {
			selectedAccounts = selectedAccounts.filter((id) => id !== accountId);
		} else {
			selectedAccounts = [...selectedAccounts, accountId];
		}
	}

	async function onClearAllAccounts() {
		selectedAccounts = [];
	}

	async function onSelectAllAccounts() {
		selectedAccounts = accounts.map((account) => account.id);
	}

	let categories: Category[] = [];
	let selectedCategories: string[] = [];

	async function onSelectCategoryFilterItem(categoryId: string) {
		if (selectedCategories.includes(categoryId)) {
			selectedCategories = selectedCategories.filter((id) => id !== categoryId);
		} else {
			selectedCategories = [...selectedCategories, categoryId];
		}
	}

	async function onClearAllCategories() {
		selectedCategories = [];
	}

	async function onSelectAllCategories() {
		selectedCategories = categories.map((category) => category.id);
	}

	$: if (selectedAccounts.length > 0 && selectedCategories.length > 0 && !transactions.length) {
		// initial load
		fetchTransactions();
	}

	// Can't create a new record if there are no accounts or categories
	$: isNewRecordDisabled = !categories.length || !accounts.length;

	// data subscriptions
	const unsubscribeFromAccountStore = accountStore.subscribe((state) => {
		accounts = state.data;
		selectedAccounts = accounts.map((account: Account) => account.id);
	});

	const unsubscribeFromCategoryStore = categoryStore.subscribe((state) => {
		categories = state.data;
		selectedCategories = categories.map((category: Category) => category.id);
	});

	const unsubscribeFromTransactionStore = transactionStore.subscribe((state) => {
		transactions = state.data;
	});

	onDestroy(() => {
		unsubscribeFromAccountStore();
		unsubscribeFromCategoryStore();
		unsubscribeFromTransactionStore();
	});

	$: displayedTransactions = transactions.filter(
		(transaction: LiftedTransaction) =>
			selectedCategories.includes(transaction.category_id) &&
			selectedAccounts.includes(transaction.account_id)
	);
</script>

<div class="flex h-full">
	<!-- Side -->
	<section class="border-r border-r-gray-700 w-[340px] sticky top-14 pb-14 h-screen overflow-auto">
		<div class="p-6 border-b border-b-gray-700 flex items-center justify-between">
			<Heading isSnug>Transactions</Heading>
			<Button
				text="New record"
				onClick={() => (showNewRecordPanel = !showNewRecordPanel)}
				isDisabled={isNewRecordDisabled}
			/>
		</div>

		<NewTransactionPanel
			showPanel={showNewRecordPanel}
			onClose={() => (showNewRecordPanel = false)}
			onSubmit={fetchTransactions}
		/>

		<div class="p-6">
			<Heading size="lg">Filters</Heading>

			<div class="grid grid-cols-2 gap-4 mt-6">
				<DateInput label="From" bind:value={formattedStartDate} onChange={fetchTransactions} />
				<DateInput label="To" bind:value={formattedEndDate} onChange={fetchTransactions} />
			</div>

			<div class="mt-6">
				<CategoriesFilter
					{selectedCategories}
					{categories}
					{onSelectCategoryFilterItem}
					{onClearAllCategories}
					{onSelectAllCategories}
				/>
			</div>

			<div class="mt-6">
				<AccountsFilter
					{selectedAccounts}
					{accounts}
					{onSelectAccountFilterItem}
					{onClearAllAccounts}
					{onSelectAllAccounts}
				/>
			</div>
		</div>
	</section>

	<!-- Main -->
	<div class="relative flex-grow">
		{#if selectedTransaction}
			<TransactionDetails transaction={selectedTransaction} onDeselect={onDeselectTransaction} />
		{/if}
		<section class="p-6 pr-12">
			{#if displayedTransactions.length > 0}
				<TransactionInsights transactions={displayedTransactions} />
			{/if}

			<div>
				<div class="flex items-center mb-2">
					<Heading isSnug>Recorded transactions</Heading>
					{#if searchValue}
						<div class="text-gray-400 mr-auto ml-4 text-sm mt-1">
							Showing results for <span class="font-semibold text-gray-300">
								"{searchValue}"
							</span>
						</div>
					{/if}
					<div class="ml-auto">
						<SearchInput
							placeholder="Search by description"
							bind:value={searchValue}
							on:input={handleSearchInput}
						/>
					</div>
				</div>
				{#if displayedTransactions.length > 0}
					<DataTable
						defaultColumns={TRANSACTION_TABLE_COLUMNS}
						defaultData={displayedTransactions}
						selectedItem={selectedTransaction}
						handleRowSelect={onSelectTransaction}
					/>
				{:else}
					<div class="text-left mt-2">
						<p class="text-gray-400">You don't have any transactions recorded yet.</p>

						{#if isNewRecordDisabled}
							<div class="rounded border border-indigo-400 max-w-md p-2 text-sm mt-4">
								<span class="text-indigo-400">Tip</span>
								<div class="flex flex-col gap-y-2">
									<p>To record a transaction, add some categories and accounts first.</p>
									<p>Then, click on the "New record" button on the top left corner.</p>
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</section>
	</div>
</div>

<style>
	section {
		-ms-overflow-style: none; /* Internet Explorer 10+ */
		scrollbar-width: none; /* Firefox */
	}
	section::-webkit-scrollbar {
		display: none; /* Safari and Chrome */
	}
</style>
