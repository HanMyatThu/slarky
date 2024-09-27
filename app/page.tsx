"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkSpaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { LoaderIcon } from "lucide-react";

const Home = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkSpaceModal();
  const { data, isLoading } = useGetWorkspaces();

  const workSpaceId = useMemo(() => {
    return data?.[0]?._id;
  }, [data]);

  useEffect(() => {
    if (!isLoading) {
      if (workSpaceId) {
        setOpen(false);
        router.push(`/workspace/${workSpaceId}`);
      } else if (!open) {
        setOpen(true);
      }
    }
  }, [workSpaceId, open, setOpen, router, isLoading]);

  return (
    <div className="flex h-full w-full justify-center items-center mt-auto ml-auto gap-3">
      <LoaderIcon className="h-8 animate-spin font-medium" />
      <span className="animate-pulse"> Loading ... </span>
    </div>
  );
};

export default Home;
