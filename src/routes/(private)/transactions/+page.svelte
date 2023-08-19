<script lang="ts">
	import Icon from '@iconify/svelte';
	import { format as dateFormat, startOfMonth } from 'date-fns';
	import { onDestroy } from 'svelte';

	import Button from '$lib/components/Button.svelte';
	import CategoryTag from '$lib/components/CategoryTag.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Selectable from '$lib/components/Selectable.svelte';
	import DateInput from '$lib/components/inputs/DateInput.svelte';
	import AmountCell from '$lib/components/table/AmountCell.svelte';
	import CategoryCell from '$lib/components/table/CategoryCell.svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import DateCell from '$lib/components/table/DateCell.svelte';
	import type { Account, Category, LiftedTransaction } from '$lib/types';
	import NewTransactionPanel from './NewTransactionPanel.svelte';
	import TransactionInsights from './TransactionInsights.svelte';

	import accountStore from '$lib/stores/accountStore';
	import categoryStore from '$lib/stores/categoryStore';
	import transactionStore from '$lib/stores/transactions';
	import TransactionDetails from './TransactionDetails.svelte';

	let transactions: LiftedTransaction[] = [];
	let selectedStartDate: Date | null = startOfMonth(new Date('2023-07-02'));
	let selectedEndDate: Date | null = new Date();

	let showCollapsible = false;
	let selectedTransaction: LiftedTransaction | null = null;

	$: formattedStartDate = selectedStartDate ? dateFormat(selectedStartDate, 'yyyy-MM-dd') : '';
	$: formattedEndDate = selectedEndDate ? dateFormat(selectedEndDate, 'yyyy-MM-dd') : '';

	async function fetchTransactions() {
		await transactionStore.fetchTransactions(formattedStartDate, formattedEndDate);
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

		await fetchTransactions();
	}

	async function onClearAllAccounts() {
		selectedAccounts = [];
		await fetchTransactions();
	}

	async function onSelectAllAccounts() {
		selectedAccounts = accounts.map((account) => account.id);
		await fetchTransactions();
	}

	let categories: Category[] = [];
	let selectedCategories: string[] = [];

	async function onSelectCategoryFilterItem(categoryId: string) {
		if (selectedCategories.includes(categoryId)) {
			selectedCategories = selectedCategories.filter((id) => id !== categoryId);
		} else {
			selectedCategories = [...selectedCategories, categoryId];
		}

		await fetchTransactions();
	}

	async function onClearAllCategories() {
		selectedCategories = [];
		await fetchTransactions();
	}

	async function onSelectAllCategories() {
		selectedCategories = categories.map((category) => category.id);
		await fetchTransactions();
	}

	$: if (selectedAccounts.length > 0 && selectedCategories.length > 0) {
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
		selectedCategories = categories
			.map((category: Category) => category.id)
			.filter((id: string) => id !== '9723abaa-de74-468e-bb77-62235cf2ea0b');
	});

	const unsubscribeFromTransactionStore = transactionStore.subscribe((state) => {
		transactions = state.data.filter(
			(transaction: LiftedTransaction) =>
				selectedCategories.includes(transaction.category_id) &&
				selectedAccounts.includes(transaction.account_id)
		);
	});

	onDestroy(() => {
		unsubscribeFromAccountStore();
		unsubscribeFromCategoryStore();
		unsubscribeFromTransactionStore();
	});

	const columns = [
		{
			header: 'Date',
			accessorKey: 'posted_at',
			cell: () => DateCell
		},
		{
			header: 'Description',
			accessorKey: 'description'
		},
		{
			header: 'Category',
			accessorFn: (transaction: LiftedTransaction) => transaction.category,
			cell: () => CategoryCell
		},
		{
			header: 'Account',
			accessorFn: (transaction: LiftedTransaction) => transaction.account.name
		},
		{
			header: 'Amount',
			accessorKey: 'amount',
			cell: () => AmountCell
		}
	];

	const humanizeAccountType = (type: string) => {
		switch (type) {
			case 'bank_account':
				return 'Bank account';
			case 'credit_card':
				return 'Credit card';
			default:
				return 'Unknown';
		}
	};
</script>

<div class="flex h-full">
	<!-- Side -->
	<section class="border-r border-r-gray-700 w-[380px] sticky top-14 h-screen overflow-auto">
		<div class="p-6 border-b border-b-gray-700 flex items-center justify-between">
			<Heading isSnug>Transactions</Heading>
			<Button
				text="New record"
				onClick={() => (showCollapsible = !showCollapsible)}
				isDisabled={isNewRecordDisabled}
			/>
		</div>

		<NewTransactionPanel
			showPanel={showCollapsible}
			onClose={() => (showCollapsible = false)}
			onSubmit={fetchTransactions}
		/>

		<div class="p-6">
			<Heading size="lg">Filters</Heading>

			<div class="flex items-end gap-x-4 mt-6">
				<DateInput label="From" bind:value={formattedStartDate} onChange={fetchTransactions} />
				<DateInput label="To" bind:value={formattedEndDate} onChange={fetchTransactions} />
			</div>

			<div class="mt-6">
				<Heading size="md">Categories</Heading>

				{#if categories.length > 0}
					<div class="my-2 flex flex-wrap gap-2">
						{#each categories as category}
							<Selectable
								on:click={() => onSelectCategoryFilterItem(category.id)}
								isSelected={selectedCategories.includes(category.id)}
							>
								<CategoryTag color={category.color} name={category.name} />
							</Selectable>
						{/each}
					</div>

					<div class="flex justify-between">
						<span class="text-sm text-gray-400">
							{selectedCategories.length} categories selected
						</span>
						{#if selectedCategories.length > 0}
							<button
								class="ml-auto text-sm text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors"
								on:click={onClearAllCategories}>Clear all</button
							>
						{:else}
							<button
								class="ml-auto text-sm text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors"
								on:click={onSelectAllCategories}>Select all</button
							>
						{/if}
					</div>
				{:else}
					<div class="text-sm text-gray-400">
						<span>You don't have any categories yet.</span>
						<span class="flex items-center">
							<a
								href="/categories"
								class="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center"
							>
								Add one here
								<Icon icon="tabler:arrow-right" class="inline-block text-lg" />
							</a>
						</span>
					</div>
				{/if}
			</div>

			<div class="mt-6">
				<Heading size="md">Accounts</Heading>

				{#if accounts.length > 0}
					<div class="my-2 flex flex-col gap-2">
						{#each accounts as account}
							<Selectable
								on:click={() => onSelectAccountFilterItem(account.id)}
								isSelected={selectedAccounts.includes(account.id)}
							>
								<div class="flex items-center px-4 py-2 rounded">
									<Icon
										icon={account.type === 'bank_account'
											? 'tabler:building-bank'
											: 'tabler:credit-card'}
										height={26}
										class="mr-2"
									/>
									<div class="flex flex-col text-left">
										<span class="font-semibold mr-4">{account.name}</span>
										<span class="text-sm">{humanizeAccountType(account.type)}</span>
									</div>
								</div>
							</Selectable>
						{/each}
					</div>

					<div class="flex justify-between">
						<span class="text-sm text-gray-400">
							{selectedAccounts.length} accounts selected
						</span>
						{#if selectedAccounts.length > 0}
							<button
								class="ml-auto text-sm text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors"
								on:click={onClearAllAccounts}>Clear all</button
							>
						{:else}
							<button
								class="ml-auto text-sm text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors"
								on:click={onSelectAllAccounts}>Select all</button
							>
						{/if}
					</div>
				{:else}
					<div class="text-sm text-gray-400">
						<span>You don't have any accounts yet.</span>
						<span class="flex items-center">
							<a
								href="/accounts"
								class="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center"
							>
								Add one here
								<Icon icon="tabler:arrow-right" class="inline-block text-lg" />
							</a>
						</span>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<!-- Main -->
	<div class="relative flex-grow">
		<TransactionDetails transaction={selectedTransaction} onDeselect={onDeselectTransaction} />
		<section class="p-6 pr-12">
			{#if transactions.length > 0}
				<TransactionInsights {transactions} />

				<div>
					<Heading>Recorded transactions</Heading>
					<DataTable
						defaultColumns={columns}
						defaultData={transactions}
						selectedItem={selectedTransaction}
						handleRowSelect={onSelectTransaction}
					/>
				</div>
			{:else}
				<div class="text-gray-400 text-center mt-20">
					<span>You don't have any transactions recorded yet.</span>
				</div>
			{/if}
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