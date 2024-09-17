import { Dispatch } from "react";
import { CopyIcon, RefreshCcw, TrashIcon } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-joincode";

interface InviteModalProps {
  open: boolean;
  setOpen: Dispatch<boolean>;
  name: string;
  joinCode: string;
}

export const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode,
}: InviteModalProps) => {
  const workspaceId = useWorkSpaceId();

  const { mutate, isPending } = useNewJoinCode();

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link is copied to clipboard"));
  };

  const handleNewCode = () => {
    mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success("Invite code regenerated");
        },
        onError: () => {
          toast.error("Failed to regenerate invite code");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite people to {name}</DialogTitle>
          <DialogDescription>
            Use the code below to invite people to your workspace
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col w-full gap-y-4 items-center justify-center py-10">
          <p className="text-4xl font-bold tracking-widest uppercase ">
            {joinCode}
          </p>
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            Copy Link
            <CopyIcon className="size-4 ml-2" />
          </Button>
        </div>
        <div className="flex w-full items-center justify-between">
          <ConfirmationModal
            label="Are you sure to regenerate a channel joincode?"
            description="This will deactivate the current invite code and generate a new one."
            onConfirm={handleNewCode}
            confirmText={"join-code"}
          >
            <Button disabled={isPending} variant="slacky" className="group">
              New Code
              <RefreshCcw className="size-4 ml-2 group-hover:animate-spin transition-all" />
            </Button>
          </ConfirmationModal>

          <DialogClose asChild>
            <Button disabled={isPending} variant="default">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
