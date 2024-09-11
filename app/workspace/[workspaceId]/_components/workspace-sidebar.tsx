import { useCurentMemberShip } from "@/features/members/api/use-current-membership";
import { useGetWorkSpaceById } from "@/features/workspaces/api/use-get-workspace-id";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, Loader } from "lucide-react";
import { WorkSpaceHeader } from "./workspace-header";

export const WorkSpaceSidebar = () => {
  const workspaceId = useWorkSpaceId();

  const { data: member, isLoading: memberLoading } = useCurentMemberShip({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } =
    useGetWorkSpaceById(workspaceId);

  if (workspaceLoading || memberLoading) {
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
    </div>
  );
};
