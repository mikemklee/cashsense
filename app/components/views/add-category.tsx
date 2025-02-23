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
import { Card } from "../ui/card";

export type AddCategoryPayload = {
  name: string;
  color: string;
};

export function AddCategory() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#5dade2");
  const submit = useSubmit();

  const handleSubmit = () => {
    submit(
      { name, color },
      {
        method: "POST",
        action: "/categories",
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
          <DialogTitle>Add new category</DialogTitle>
          <DialogDescription>
            Please fill in the category details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Groceries"
              onChange={(e) => setName(e.target.value)}
              className="col-span-3 bg-card-foreground/10"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Color
            </Label>
            <Input
              id="color"
              type="color"
              defaultValue={color}
              onChange={(e) => setColor(e.target.value)}
              className="col-span-1 p-0"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!name || !color}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
