import { Dispatch, useState } from "react";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspaces";
import { useDeleteWorkspace } from "@/features/workspaces/api/use-detele-workspace";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";

interface PreferenceModalProps {
  open: boolean;
  setOpen: Dispatch<boolean>;
  initialValue: string;
}

export const PreferencesModal = ({
  open,
  setOpen,
  initialValue,
}: PreferenceModalProps) => {
  const workspaceId = useWorkSpaceId();
  const router = useRouter();

  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);

  const { mutate: updateWorkspace, isPending: pendingUpdate } =
    useUpdateWorkspace();
  const { mutate: deleteWOrkspace, isPending: pendingDelete } =
    useDeleteWorkspace();

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateWorkspace(
      { id: workspaceId, name: value },
      {
        onSuccess: () => {
          toast.success("Workspace Updated");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update workspace");
        },
      }
    );
  };

  const handleDelete = () => {
    deleteWOrkspace(
      { id: workspaceId },
      {
        onSuccess: () => {
          toast.success("Workspace Removed");
          router.replace("/");
        },
        onError: () => {
          toast.error("Failed to remove workspace");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogContent className="p-0 bg-gray-50 overflow-hidden">
        <DialogHeader className="p-4 border-b bg-white">
          <DialogTitle>{value}</DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-4 flex flex-col gap-y-2">
          <Dialog open={editOpen} onOpenChange={(value) => setEditOpen(value)}>
            <DialogTrigger asChild>
              <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Workspace name</p>
                  <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                    Edit
                  </p>
                </div>
                <p className="text-sm">{value}</p>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename this workspace</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEdit} className="space-y-5 mt-2">
                <Input
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  type="text"
                  placeholder="Workspace name e.g. 'Work', 'Personal', 'Study'."
                  disabled={pendingUpdate}
                  autoFocus
                  minLength={3}
                  maxLength={30}
                />
                <DialogFooter className="flex flex-row justify-end gap-x-3">
                  <DialogClose>
                    <Button
                      disabled={pendingUpdate}
                      type="button"
                      variant="outline"
                    >
                      Close
                    </Button>
                  </DialogClose>
                  <Button
                    disabled={pendingUpdate}
                    type="submit"
                    variant="default"
                  >
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <button
            disabled={pendingDelete}
            onClick={handleDelete}
            className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
          >
            <TrashIcon className="size-4" />
            <p className="text-sm font-semibold">Delete Workspace</p>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
