"use client";
import { useEffect } from "react";

import { Loader } from "@/components/common/loader";
import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";

import { useMemberId } from "@/hooks/use-member-id";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { Error } from "@/components/common/error";
import { Conversation } from "./_components/conversation";

const MemberIdPage = () => {
  const workspaceId = useWorkSpaceId();
  const memberId = useMemberId();

  const { data, mutate, isPending } = useCreateOrGetConversation();

  useEffect(() => {
    mutate({
      workspaceId,
      memberId,
    });
  }, [workspaceId, memberId, mutate]);

  if (isPending) {
    return <Loader />;
  }

  if (!data) {
    return <Error message="Conversation not found" />;
  }

  return <Conversation id={data._id} />;
};

export default MemberIdPage;
