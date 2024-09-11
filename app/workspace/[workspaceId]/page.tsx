"use client";

import { useGetWorkSpaceById } from "@/features/workspaces/api/use-get-workspace-id";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";

const WorkSpaceIdPage = () => {
  const workspaceId = useWorkSpaceId();
  const workSpace = useGetWorkSpaceById(workspaceId);
  console.log(workSpace, " workspace");

  return (
    <div>
      hi
      {workspaceId}
    </div>
  );
};

export default WorkSpaceIdPage;
