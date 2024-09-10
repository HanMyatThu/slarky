"use client";
import { useEffect, useState } from "react";

import { WorkSpaceModal } from "@/features/workspaces/components/workspace-modal";

export const Modals = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <WorkSpaceModal />
    </>
  );
};
