import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export const useGetWorkspaces = () => {
  const data = useQuery(api.workspaces.getAllWorkSpaces);
  console.log(data, "data");
  const isLoading = data === undefined;

  return { data, isLoading };
};
