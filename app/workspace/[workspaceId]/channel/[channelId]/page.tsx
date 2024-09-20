"use client";
import { Loader, TriangleAlert } from "lucide-react";

import { useGetChannelById } from "@/features/channels/api/use-get-channel-id";
import { useChannelId } from "@/hooks/use-channel-id";
import { Header } from "./_components/header";
import { ChatInput } from "./_components/chat-input";
import { useGetMessages } from "@/features/messages/api/use-get-messages";

const ChannelIdPage = () => {
  const channelId = useChannelId();

  const { results } = useGetMessages({ channelId });
  const { data: channel, isLoading: channelLoading } = useGetChannelById({
    id: channelId,
  });

  if (channelLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
        <TriangleAlert className="size-5 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Channel not found{" "}
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full">
      <Header title={channel.name} />
      <div className="flex-1 text-wrap">{JSON.stringify(results)}</div>
      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  );
};

export default ChannelIdPage;
