"use client";
import { useEffect, useMemo } from "react";

import { UserButton } from "@/components/common/user-button";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkSpaceModal } from "@/features/store/use-create-workspace-modal";

const Home = () => {
  const [open, setOpen] = useCreateWorkSpaceModal();
  const { data, isLoading } = useGetWorkspaces();

  const workSpaceId = useMemo(() => {
    return data?.[0]?._id;
  }, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workSpaceId) {
    } else if (!open) {
      setOpen(true);
    }
  }, [isLoading, workSpaceId, open, setOpen]);

  return (
    <div>
      Hello <span>World</span>
      <UserButton />
    </div>
  );
};

export default Home;
