"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo } from "react";

import { Account } from "@/routes/accounts";
import { DataTable } from "../ui/data-table";

export type Transaction = {
  id: string;
  createdAt: Date;
  postedAt: Date;
  amount: number;
  description: string;
  account?: Account;
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
          const date = row.getValue<Date>("postedAt");

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
                className="rounded-full w-4 h-4"
                src={account.imageUrl}
                alt={account.name}
              />
              <span>{account.name}</span>
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
              className={`text-right font-medium ${amount < 0 ? "text-red-400/90" : "text-green-400/90"}`}
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
