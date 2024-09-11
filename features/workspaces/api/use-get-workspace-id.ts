import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const useGetWorkSpaceById = (id: Id<"workspaces">) => {
  const data = useQuery(api.workspaces.getWorkSpaceById, { id });
  const isLoading = data === undefined;

  return { data, isLoading };
};
