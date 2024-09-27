import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
import {
  AlertTriangle,
  XIcon,
  Loader,
  MailIcon,
  ChevronDownIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { useRemoveMember } from "@/features/members/api/use-remove-member";
import { useCurentMemberShip } from "@/features/members/api/use-current-membership";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const workspaceId = useWorkSpaceId();
  const router = useRouter();

  const { data: currentMember, isLoading: currentMemberLoading } =
    useCurentMemberShip({ workspaceId });
  const { data: member, isLoading: isMemberLoading } = useGetMember({
    id: memberId,
  });

  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();
  const { mutate: removingMember, isPending: isRemovingMember } =
    useRemoveMember();

  const onRemove = () => {
    removingMember(
      { id: memberId, workspaceId },
      {
        onSuccess: () => {
          toast.success("Member removed");
          onClose();
        },
        onError: () => {
          toast.error("Failed to remove member");
        },
      }
    );
  };

  const onLeave = () => {
    removingMember(
      { id: memberId, workspaceId },
      {
        onSuccess: () => {
          router.replace("/");
          toast.success("You left the workspace");
          onClose();
        },
        onError: () => {
          toast.error("Failed to leave the workspace");
        },
      }
    );
  };

  const onRoleChange = (role: "admin" | "member") => {
    updateMember(
      { id: memberId, role, workspaceId },
      {
        onSuccess: () => {
          toast.success("Role changed");
        },
        onError: () => {
          toast.error("Failed to change role");
        },
      }
    );
  };

  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full items-center justify-center flex-col gap-y-4">
          <AlertTriangle className="size-5" />
          <p className="text-xs text-muted-foreground">Profile Not Found</p>
        </div>
      </div>
    );
  }

  if (isMemberLoading || currentMemberLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full items-center justify-center flex-col gap-y-4">
          <Loader className="size-5 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <p className="text-lg font-bold">Profile</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="flex items-center justify-center p-4">
        <Avatar className="max-w-[250px] max-h-[250px] size-full rounded-md">
          <AvatarImage src={member.user.image} />
          <AvatarFallback className="aspect-square text-6xl">
            {member.user.name?.charAt(0).toUpperCase() || "M"}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col p-4">
        <p className="text-xl font-bold">{member.user.name}</p>
        {currentMember?.role === "admin" && currentMember?._id !== memberId ? (
          <div className="items-center flex gap-2 mt-4">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button className="w-full">
                  {member.role} <ChevronDownIcon className="size-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuRadioGroup
                  value={member.role}
                  onValueChange={(role) =>
                    onRoleChange(role as "admin" | "member")
                  }
                >
                  <DropdownMenuRadioItem value="admin">
                    Admin
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="member">
                    Member
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <ConfirmationModal
              label="Confirm your action!"
              description="Are you sure you want to remove this member from this workspace?"
              confirmText="remove"
              onConfirm={onRemove}
            >
              <Button className="w-full">Remove</Button>
            </ConfirmationModal>
          </div>
        ) : currentMember?._id === memberId &&
          currentMember?.role !== "admin" ? (
          <div className="mt-4">
            <ConfirmationModal
              label="Are you sure you want to leave this workspace?"
              confirmText="leave"
              onConfirm={onLeave}
            >
              <Button>Leave</Button>
            </ConfirmationModal>
          </div>
        ) : null}
      </div>
      <Separator />
      <div className="flex flex-col p-4">
        <p className="text-sm font-bold mb-4">Contact Information</p>
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-md bg-muted flex items-center justify-center">
            <MailIcon className="size-4" />
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-semibold text-muted-foreground">
              Email Address
            </p>
            <Link
              href={`mailto:${member.user.email}`}
              className="text-sm hover:underline text-[#1264a3]"
            >
              {member.user.email}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
