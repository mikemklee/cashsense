import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { Account } from "types/account";
import { Category } from "types/category";
import { Transaction } from "types/transaction";
import Main from "~/components/ui/main";
import AccountList from "~/components/views/account-list";
import {
  AddTransaction,
  AddTransactionPayload,
} from "~/components/views/add-transaction";
import CategoryList from "~/components/views/category-list";
import TransactionList from "~/components/views/transaction-list";

export const meta: MetaFunction = () => {
  return [
    { title: "Cashsense" },
    { name: "description", content: "Your personal finance copilot" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      request,
      response,
    }
  );

  let { data, error } = await supabase
    .from("transactions")
    .select(
      `
    *,
    account:accounts (id, name, image_url),
    category:categories (id, name, color)
    `
    )
    .order("posted_at", { ascending: false });

  if (!data || error) {
    return Response.json("Failed to fetch transactions", { status: 500 });
  }

  const formattedTransactions: Transaction[] = data.map((t) => ({
    id: t.id,
    createdAt: new Date(t.created_at),
    postedAt: new Date(t.posted_at),
    amount: t.amount,
    description: t.description,
    account: t.account
      ? ({
          id: t.account.id,
          name: t.account.name,
          imageUrl: t.account.image_url,
        } as Account)
      : undefined,
    category: t.category as Category,
  }));

  ({ data, error } = await supabase.from("accounts").select("*"));

  if (!data || error) {
    return Response.json("Failed to fetch accounts", { status: 500 });
  }

  const formattedAccounts: Account[] = data.map((el) => ({
    id: el.id,
    createdAt: new Date(el.created_at),
    name: el.name,
    type: el.type,
    imageUrl: el.image_url,
  }));

  ({ data, error } = await supabase.from("categories").select("*"));

  if (!data || error) {
    return Response.json("Failed to fetch categories", { status: 500 });
  }

  const formattedCategories: Category[] = data.map((el) => ({
    id: el.id,
    createdAt: new Date(el.created_at),
    name: el.name,
    color: el.color,
  }));

  return Response.json(
    {
      transactions: formattedTransactions,
      accounts: formattedAccounts,
      categories: formattedCategories,
    },
    {
      headers: response.headers,
    }
  );
};

export default function Index() {
  const { transactions, accounts, categories } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const handleCreateTransaction = async (payload: AddTransactionPayload) => {
    submit(payload, {
      method: "POST",
      action: "/transactions",
      encType: "application/json",
    });
  };

  return (
    <Main>
      <AccountList accounts={accounts} />
      <CategoryList categories={categories} />
      <div className="flex justify-between items-center pt-8 pb-2">
        <h1>Recent transactions</h1>
        <AddTransaction onSubmit={handleCreateTransaction} />
      </div>
      <TransactionList transactions={transactions} />
    </Main>
  );
}
