import { useState, useRef, ElementRef } from "react";
import { Loader } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ConfirmationModalProps {
  children: React.ReactNode;
  label: string;
  onConfirm: () => void;
  description?: string;
  confirmText: string;
}

export const ConfirmationModal = ({
  children,
  label,
  onConfirm,
  description,
  confirmText = "confirm",
}: ConfirmationModalProps) => {
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const closeRef = useRef<ElementRef<"button">>(null);

  const handleClose = () => {
    setConfirm("");
  };

  const isCorrectInput = confirm === confirmText;

  const handleConfirm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isCorrectInput) {
      setLoading(true);
      setTimeout(() => {
        closeRef.current?.click();
        setLoading(false);
        setTimeout(() => {
          onConfirm();
        }, 300);
      }, 300);
    }
  };

  return (
    <Dialog onOpenChange={handleClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={handleConfirm} className="space-y-2 mt-2">
          <Label className="text-xs text-muted-foreground">
            Please Enter{" "}
            <span className="text-red-500">{`"${confirmText}"`}</span> to
            confirm your action.
          </Label>
          <Input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            type="text"
            required
            placeholder="Enter Confirm Text"
          />
          <DialogFooter className="flex flex-row justify-end gap-x-2 pt-5">
            <DialogClose>
              <Button ref={closeRef} variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={!isCorrectInput || loading}
              variant="default"
              type="submit"
            >
              Confirm
              {loading && <Loader className="size-4 ml-2 animate-spin" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
