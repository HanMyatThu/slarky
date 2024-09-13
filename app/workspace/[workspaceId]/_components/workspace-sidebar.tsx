import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";

import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { useCurentMemberShip } from "@/features/members/api/use-current-membership";
import { useGetWorkSpaceById } from "@/features/workspaces/api/use-get-workspace-id";
import { useGetChannels } from "@/features/channels/api/use-get-channel";

import { SidebarItem } from "./sidebar-item";
import { WorkSpaceHeader } from "./workspace-header";
import { WorkspaceSection } from "./workspace-section";

export const WorkSpaceSidebar = () => {
  const workspaceId = useWorkSpaceId();

  const { data: member, isLoading: memberLoading } = useCurentMemberShip({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } =
    useGetWorkSpaceById(workspaceId);
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });

  if (workspaceLoading || memberLoading || channelsLoading) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
        <Loader className="size-6 animate-spin text-white" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center gap-y-3">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full">
      <WorkSpaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Drafts & Sent" icon={SendHorizonal} id="draft" />
      </div>

      <WorkspaceSection label="Channels" hint="New Channel" onNew={() => {}}>
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            icon={HashIcon}
            label={item.name}
            id={item._id}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};
