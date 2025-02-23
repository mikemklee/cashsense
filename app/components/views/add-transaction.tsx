import { NotebookPen } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export type AddTransactionPayload = {
  amount: number;
  description: string;
};

type Props = {
  onSubmit: (payload: AddTransactionPayload) => void;
};

export function AddTransaction({ onSubmit }: Props) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    onSubmit({ amount: parseInt(amount), description });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <Button size="sm">
            <NotebookPen />
            New
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record transaction</DialogTitle>
          <DialogDescription>
            Please fill in the transaction details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount ($)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="4.99"
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3 bg-card-foreground/10"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              placeholder="Starbucks"
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 bg-card-foreground/10"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
