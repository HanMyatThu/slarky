"use client";

import { useGetWorkSpaceById } from "@/features/workspaces/api/use-get-workspace-id";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";

const WorkSpaceIdPage = () => {
  const workspaceId = useWorkSpaceId();
  const { data, isLoading } = useGetWorkSpaceById(workspaceId);

  return (
    <div>
      hi
      {workspaceId}
    </div>
  );
};

export default WorkSpaceIdPage;
