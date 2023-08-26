import AmountCell from '$lib/components/table/AmountCell.svelte';
import CategoryCell from '$lib/components/table/CategoryCell.svelte';
import DateCell from '$lib/components/table/DateCell.svelte';
import type { LiftedTransaction } from '$lib/types';

export const TRANSACTION_TABLE_COLUMNS = [
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
    accessorKey: 'adjustedAmount',
    cell: () => AmountCell
  }
];