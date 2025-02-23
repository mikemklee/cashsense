"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo } from "react";

import { Account } from "types/account";
import { Category } from "types/category";
import { DataTable } from "../ui/data-table";

export type Transaction = {
  id: string;
  createdAt: Date;
  postedAt: Date;
  amount: number;
  description: string;
  account?: Account;
  category?: Category;
};

export type Props = {
  transactions: Transaction[];
};

export default function TransactionList({ transactions = [] }: Props) {
  const columns: ColumnDef<Transaction>[] = useMemo(
    () => [
      {
        accessorKey: "postedAt",
        header: "Date",
        cell: ({ row }) => {
          const rawDate = row.getValue<Date>("postedAt");
          const date = new Date(rawDate);

          const timeMs = date.getTime();
          const tzOffsetMs = date.getTimezoneOffset() * 60 * 1000;
          const adjustedTimeMs = timeMs + tzOffsetMs;

          return <div>{format(adjustedTimeMs, "MMM d, yyyy")}</div>;
        },
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "account",
        header: () => <div className="text-right">Account</div>,
        cell: ({ row }) => {
          const rawAccount = row.getValue("account");

          const account = rawAccount as Account;

          return (
            <div className="flex items-center gap-2 justify-end">
              <img
                className="rounded-sm w-5 h-5"
                src={account.imageUrl}
                alt={account.name}
              />
              <span>{account.name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "category",
        header: () => <div className="text-right">Category</div>,
        cell: ({ row }) => {
          const rawCategory = row.getValue("category");

          const category = rawCategory as Category;

          return (
            <div className="flex items-center gap-x-2 justify-end">
              <span
                className="w-1.5 h-4 rounded-sm"
                style={{ backgroundColor: category.color }}
              />
              <span>{category.name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
          const amountInCents = parseFloat(row.getValue("amount"));
          const amount = amountInCents / 100;

          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount);

          return (
            <div
              className={`text-right font-medium ${
                amount < 0 ? "text-red-400/90" : "text-green-400/90"
              }`}
            >
              {formatted}
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="container">
      <DataTable columns={columns} data={transactions} />
    </div>
  );
}
