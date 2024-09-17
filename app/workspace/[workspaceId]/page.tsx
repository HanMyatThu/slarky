"use client";

import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader, TriangleAlert } from "lucide-react";

import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { useCreateChannelModal } from "@/features/channels/store/use-create-workspace-modal";
import { useGetChannels } from "@/features/channels/api/use-get-channel";
import { useGetWorkSpaceById } from "@/features/workspaces/api/use-get-workspace-id";
import { useCurentMemberShip } from "@/features/members/api/use-current-membership";

const WorkSpaceIdPage = () => {
  const workspaceId = useWorkSpaceId();
  const router = useRouter();
  const [open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurentMemberShip({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } =
    useGetWorkSpaceById(workspaceId);
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === "admin", [member]);

  useEffect(() => {
    if (
      workspaceLoading ||
      channelsLoading ||
      memberLoading ||
      !member ||
      !workspace
    )
      return;

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    channelId,
    workspaceLoading,
    memberLoading,
    member,
    isAdmin,
    channelsLoading,
    workspace,
    router,
    open,
    setOpen,
    workspaceId,
  ]);

  if (workspaceLoading || channelsLoading) {
    return (
      <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6  text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace not found
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-6  text-muted-foreground" />
      <span className="text-sm text-muted-foreground">No channel found</span>
    </div>
  );
};

export default WorkSpaceIdPage;
