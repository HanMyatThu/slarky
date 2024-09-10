"use client";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkSpaceModal } from "../store/use-create-workspace-modal";
import { useCreateWorkSpaces } from "../api/use-create-workspaces";
import { useState } from "react";

export const WorkSpaceModal = () => {
  const [open, setOpen] = useCreateWorkSpaceModal();
  const [name, setName] = useState("");

  const { mutate, isPending } = useCreateWorkSpaces();

  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await mutate(
      { name },
      {
        onSuccess: (data) => {
          console.log(data, "data");
          router.push(`/workspace/${data?._id}`);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            value={name}
            disabled={isPending}
            autoFocus
            minLength={3}
            required
            onChange={(e) => setName(e.target.value)}
            placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
          />
          <div className="flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
