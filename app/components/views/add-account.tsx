import { Plus } from "lucide-react";
import { useState } from "react";

import { useSubmit } from "@remix-run/react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card } from "../ui/card";

export type AddAccountPayload = {
  name: string;
  type: string;
};

export function AddAccount() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const submit = useSubmit();

  const handleSubmit = () => {
    submit(
      { name, type },
      {
        method: "POST",
        action: "/accounts",
        encType: "application/json",
      }
    );

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="w-12 bg-card-foreground/3 border border-card-foreground/10 flex items-center justify-center cursor-pointer group">
          <Plus className="opacity-30 group-hover:opacity-100 transition-opacity" />
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new account</DialogTitle>
          <DialogDescription>
            Please fill in the account details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Type
            </Label>
            <Select onValueChange={(value) => setType(value)} value={type}>
              <SelectTrigger className="col-span-3 bg-card-foreground/10">
                <SelectValue placeholder="Select an account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_account">Bank account</SelectItem>
                <SelectItem value="credit_card">Credit card</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nickname
            </Label>
            <Input
              id="name"
              placeholder="e.g. Amex"
              onChange={(e) => setName(e.target.value)}
              className="col-span-3 bg-card-foreground/10"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!name || !type}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
