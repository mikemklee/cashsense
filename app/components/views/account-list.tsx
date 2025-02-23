import { Account } from "types/account";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function AccountList({
  accounts = [],
}: {
  accounts: Account[];
}) {
  return (
    <>
      <div className="flex justify-between items-center pt-4 pb-2">
        <h1>Accounts</h1>
      </div>
      <div className="flex">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </>
  );
}

export function AccountCard({ account }: { account: Account }) {
  const formattedType =
    account.type === "bank_account" ? "Bank account" : "Credit card";

  return (
    <Card className="w-48 bg-card-foreground/3 border border-card-foreground/10">
      <CardHeader>
        <div className="relative flex items-center gap-4">
          <img
            className="rounded-sm w-8 h-8"
            src={account.imageUrl}
            alt={account.name}
          />
          <div>
            <CardTitle>{account.name}</CardTitle>
            <CardDescription>{formattedType}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
