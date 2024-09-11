import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface useCurentMemberProps {
  workspaceId: Id<"workspaces">;
}

export const useCurentMemberShip = ({ workspaceId }: useCurentMemberProps) => {
  const data = useQuery(api.members.getCurrentMembership, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
