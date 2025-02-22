import { Account } from "./account";

export type Transaction = {
  id: string;
  createdAt: Date;
  postedAt: Date;
  amount: number;
  description: string;
  account?: Account;
};
