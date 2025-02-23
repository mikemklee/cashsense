import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { Account } from "types/account";
import { Transaction } from "types/transaction";
import Main from "~/components/ui/main";
import { AddTransaction } from "~/components/views/add-transaction";
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

  const { data, error } = await supabase.from("transactions").select(`
    *,
    account:accounts (id, name, image_url),
    category:categories (id, name, color)
    `);

  if (!data || error) {
    return Response.json("Failed to fetch transactions", { status: 500 });
  }

  const formatted: Transaction[] = data.map((t) => ({
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
  }));

  return Response.json(
    {
      transactions: formatted,
    },
    {
      headers: response.headers,
    }
  );
};

export default function Index() {
  const { transactions } = useLoaderData<typeof loader>();

  return (
    <Main>
      {/* <div className="flex justify-between items-center pt-4 pb-2">
        <h1>Accounts</h1>
      </div>
      <div className="flex">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>

      <div className="flex justify-between items-center pt-8 pb-2">
        <h1>Categories</h1>
      </div>
      <div className="flex">
        {categories.map((category) => (
          <CategoryTag key={category.id} category={category} />
        ))}
      </div> */}

      <div className="flex justify-between items-center pt-8 pb-2">
        <h1>Recent transactions</h1>
        <AddTransaction />
      </div>
      <TransactionList transactions={transactions} />
    </Main>
  );
}
