import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Id } from "@/convex/_generated/dataModel";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import Quill from "quill";
import { toast } from "sonner";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";

import { Button } from "@/components/ui/button";
import { Message } from "@/components/message/message";
import { useGetMessageByIdById } from "@/features/messages/api/use-get-message";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useCurentMemberShip } from "@/features/members/api/use-current-membership";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { useChannelId } from "@/hooks/use-channel-id";

const TIME_THRESHOLD = 5;

const Editor = dynamic(() => import("@/components/common/editor"), {
  ssr: false,
});
interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  parentMessageId: Id<"messages">;
  body: string;
  image: Id<"_storage"> | undefined;
};

const formatDateLabel = (dateString: string) => {
  const date = new Date(dateString);

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
};

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkSpaceId();
  const channelId = useChannelId();

  const [editing, setEditing] = useState<Id<"messages"> | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [pending, setPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);

  const { data: currentMember, isLoading: memberLoading } = useCurentMemberShip(
    { workspaceId }
  );
  const { data: message, isLoading: messageLoading } = useGetMessageByIdById({
    id: messageId,
  });
  const { results, loadMore, status } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });

  const isLoadingMore = status === "LoadingMore";
  const canLoadMore = status === "CanLoadMore";

  const groupMessages = results?.reduce(
    (groups, message) => {
      const date = new Date(message!._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof results>
  );

  const { mutate: uploadImage } = useGenerateUploadUrl();
  const { mutate: createMessage } = useCreateMessage();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    setPending(true);
    editorRef.current?.enable(false);
    try {
      const values: CreateMessageValues = {
        workspaceId,
        channelId,
        parentMessageId: messageId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await uploadImage({}, { throwError: true });

        if (!url) {
          throw new Error("Undefined URL");
        }

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to upload Image");
        }

        const { storageId } = await result.json();

        values.image = storageId;
      }

      createMessage(values, { throwError: true });

      setEditorKey((prevKey) => prevKey + 1);
    } catch (e) {
      toast.error("Failed to send message");
    } finally {
      editorRef.current?.enable(true);
      setPending(false);
    }
  };

  if (messageLoading || memberLoading || status === "LoadingFirstPage") {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!message) {
    return (
      <>
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <p className="text-lg font-bold">Thread</p>
            <Button onClick={onClose} size="iconSm" variant="ghost">
              <XIcon className="size-5 stroke-[1.5]" />
            </Button>
          </div>
          <div className="flex h-full items-center justify-center flex-col gap-y-4">
            <AlertTriangle className="size-5" />
            <p className="text-xs text-muted-foreground">Message Not Found</p>
          </div>
        </div>
        ;
      </>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
        {Object.entries(groupMessages || {}).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
              <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border-gray-300 shadow-sm">
                {formatDateLabel(dateKey)}
              </span>
            </div>
            {messages.map((message, index) => {
              if (!message) return null;

              const prevMessage = messages[index - 1]!;
              const isCompact =
                prevMessage &&
                prevMessage.user._id === message.user?._id &&
                differenceInMinutes(
                  new Date(message._creationTime),
                  new Date(prevMessage._creationTime)
                ) < TIME_THRESHOLD;

              return (
                <Message
                  key={message._id}
                  id={message._id}
                  memberId={message.memberId}
                  authorImage={message.user.image}
                  authorName={message.user.name}
                  isAuthor={message.memberId === currentMember?._id}
                  reactions={message.reactions}
                  body={message.body}
                  image={message.image}
                  updatedAt={message.updatedAt}
                  createdAt={message._creationTime}
                  isEditing={editing === message._id}
                  setEditingId={setEditing}
                  isCompact={isCompact}
                  hideThreadButton
                  threadCount={message.threadCount}
                  threadImage={message.threadImage}
                  threadTimestamp={message.threadTimestamp}
                />
              );
            })}
          </div>
        ))}
        <div
          className="h-1"
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && canLoadMore) {
                    loadMore();
                  }
                },
                {
                  threshold: 1.0,
                }
              );
              observer.observe(el);
              return () => observer.disconnect();
            }
          }}
        />
        {isLoadingMore && (
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border-gray-300 shadow-sm">
              <Loader className="size-4 animate-spin" />
            </span>
          </div>
        )}
        <Message
          id={message._id}
          memberId={message.memberId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={message.memberId === currentMember?._id}
          reactions={message.reactions}
          body={message.body}
          image={message.image}
          updatedAt={message.updatedAt}
          createdAt={message._creationTime}
          isEditing={editing === message._id}
          setEditingId={setEditing}
          hideThreadButton
        />
      </div>
      <div className="px-4">
        <Editor
          key={editorKey}
          onSubmit={handleSubmit}
          innerRef={editorRef}
          disabled={pending}
          placeHOlder="Reply.."
        />
      </div>
    </div>
  );
};
