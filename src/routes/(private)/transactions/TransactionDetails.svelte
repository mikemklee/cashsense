<script lang="ts">
	import AmountSpan from '$lib/components/AmountSpan.svelte';
	import Button from '$lib/components/Button.svelte';
	import CategoryTag from '$lib/components/CategoryTag.svelte';
	import DateSpan from '$lib/components/DateSpan.svelte';
	import Drawer from '$lib/components/Drawer.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import transactionStore from '$lib/stores/transactions';
	import type { LiftedTransaction } from '$lib/types';
	import EditTransactionPanel from './EditTransactionPanel.svelte';

	export let transaction: LiftedTransaction;

	let showEditPanel = false;
	let adjustedTransactionAmount =
		transaction.amount +
		transaction.adjustments.reduce((acc, adjustment) => acc + adjustment.amount, 0);

	export let onDeselect = () => {};

	const onDelete = async (transactionId?: string) => {
		if (!transactionId) return;
		await transactionStore.deleteTransaction(transactionId);
		handleDeselect();
	};

	const handleDeselect = () => {
		showEditPanel = false;
		onDeselect();
	};
</script>

<Drawer onClose={handleDeselect}>
	<div slot="header" class="p-6 flex items-center justify-between text-lg">
		<Heading isSnug>
			{#if showEditPanel}
				Edit record
			{:else}
				Transaction details
			{/if}
		</Heading>
	</div>

	{#if !showEditPanel}
		<div class="px-6 flex flex-col gap-2">
			{#if transaction.vendor}
				<div>
					<span class="text-sm text-gray-400">Vendor</span>
					<div>
						{transaction.vendor.name}
					</div>
				</div>
			{/if}

			<div>
				<span class="text-sm text-gray-400">Category</span>
				<CategoryTag color={transaction.category.color} name={transaction.category.name} />
			</div>

			<div>
				<span class="text-sm text-gray-400">Account</span>
				<div>{transaction.account.name}</div>
			</div>

			<div>
				<span class="text-sm text-gray-400">Date</span>
				<DateSpan value={transaction.posted_at} />
			</div>

			<div class="grid grid-cols-2">
				<div>
					<span class="text-sm text-gray-400">Description</span>
					<div>{transaction.description}</div>
				</div>
				<div class="text-right">
					<span class="text-sm text-gray-400">Original amount</span>
					<AmountSpan value={transaction.amount} />
				</div>
			</div>

			{#if transaction.adjustments.length > 0}
				<div class="mt-2">
					<div>
						<div class="flex items-center gap-4">
							<span class="text-sm text-gray-400 mb-1">Adjustments</span>
							<div class="border-t border-gray-700 w-full full" />
						</div>

						{#each transaction.adjustments as adjustment}
							<div class="flex">
								<!-- <input type="checkbox" checked={adjustment.is_adjusted} /> -->
								<div class="mr-auto">{adjustment.description}</div>
								<AmountSpan value={adjustment.amount} />
							</div>
						{/each}
					</div>
					{#if adjustedTransactionAmount}
						<div class="text-right my-4">
							<span class="text-sm text-gray-400">Adjusted amount</span>
							<AmountSpan value={adjustedTransactionAmount} />
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<div class="flex justify-end px-6 gap-4 mt-4">
			<Button text="Edit" style="secondary" onClick={() => (showEditPanel = true)} />
			<Button text="Delete" style="alert" onClick={() => onDelete(transaction.id)} />
		</div>
	{:else}
		<EditTransactionPanel
			{transaction}
			onClose={() => (showEditPanel = false)}
			onSubmit={handleDeselect}
		/>
	{/if}
</Drawer>
