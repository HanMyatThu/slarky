"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { UserButton } from "@/components/common/user-button";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkSpaceModal } from "@/features/workspaces/store/use-create-workspace-modal";

const Home = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkSpaceModal();
  const { data, isLoading } = useGetWorkspaces();

  const workSpaceId = useMemo(() => {
    return data?.[0]?._id;
  }, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workSpaceId) {
      router.push(`/workspace/${workSpaceId}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [isLoading, workSpaceId, open, setOpen, router]);

  return (
    <div>
      <UserButton />
    </div>
  );
};

export default Home;
