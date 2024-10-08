import dynamic from "next/dynamic";
import { format, isToday, isYesterday } from "date-fns";

import { usePanel } from "@/hooks/use-panel";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { ToolTipHint } from "@/components/common/tooltip-hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./toolbar";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";
import { Reactions } from "./reactions";
import { ThreadBar } from "./thread-bar";

const Renderer = dynamic(() => import("@/components/message/renderer"), {
  ssr: false,
});
const Editor = dynamic(() => import("@/components/common/editor"), {
  ssr: false,
});

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
  threadName?: string;
}

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};

export const Message = ({
  id,
  memberId,
  authorImage,
  authorName = "Member",
  isAuthor,
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  threadCount,
  threadImage,
  threadTimestamp,
  threadName,
  hideThreadButton,
}: MessageProps) => {
  const { onOpenMessage, onOpenProfile } = usePanel();

  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();
  const { mutate: removeMessage, isPending: isRemovingMessage } =
    useRemoveMessage();
  const { mutate: toggleReaction, isPending: isReacting } = useToggleReaction();

  const isPending = isUpdatingMessage || isRemovingMessage || isReacting;

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success("Message updated");
          setEditingId(null);
        },
        onError: () => {
          toast.error("Failed to update message");
          setEditingId(null);
        },
      }
    );
  };

  const handleRemove = () => {
    removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success("Message deleted");
        },
        onError: () => {
          toast.error("Failed to delete message");
        },
      }
    );
  };

  const handleReaction = (value: string) => {
    toggleReaction(
      {
        messageId: id,
        value,
      },
      {
        onError: () => {
          toast.error("Failed to send reaction");
        },
      }
    );
  };

  if (isCompact) {
    return (
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
          isRemovingMessage &&
            "bg-red-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
        )}
      >
        <div className="flex items-start gap-2">
          <ToolTipHint label={formatFullTime(new Date(createdAt))}>
            <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline transition-opacity">
              {format(new Date(createdAt), "hh:mm")}
            </button>
          </ToolTipHint>
          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                onSubmit={handleUpdate}
                disabled={isUpdatingMessage}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <>
              <div className="flex flex-col w-full">
                <Thumbnail url={image} />
                <Renderer value={body} />
                {updatedAt ? (
                  <span className="text-xs text-muted-foreground">
                    (edited)
                  </span>
                ) : null}
                <Reactions data={reactions} onChange={handleReaction} />
                <ThreadBar
                  onClick={() => onOpenMessage(id)}
                  count={threadCount}
                  image={threadImage}
                  name={threadName}
                  timestamp={threadTimestamp}
                />
              </div>
            </>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleRemove}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
        isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
        isRemovingMessage &&
          "bg-red-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
      )}
    >
      <div className="flex items-start gap-2">
        <button onClick={() => onOpenProfile(memberId)}>
          <Avatar className="rounded-md">
            <AvatarImage className="rounded-md" src={authorImage} />
            <AvatarFallback className="bg-sky-400 text-white text-xs">
              {authorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
        {isEditing ? (
          <div className="w-full h-full">
            <Editor
              onSubmit={handleUpdate}
              disabled={isUpdatingMessage}
              defaultValue={JSON.parse(body)}
              onCancel={() => setEditingId(null)}
              variant="update"
            />
          </div>
        ) : (
          <div className="flex flex-col w-full overflow-hidden">
            <div className="text-sm">
              <button
                onClick={() => onOpenProfile(memberId)}
                className="font-bold text-primary hover:underline"
              >
                {authorName}
              </button>
              <span>&nbsp;&nbsp;</span>
              <ToolTipHint label={formatFullTime(new Date(createdAt))}>
                <button className="text-xs text-muted-foreground hover:underline">
                  {format(new Date(createdAt), "h:mm a")}
                </button>
              </ToolTipHint>
            </div>
            <Thumbnail url={image} />
            <Renderer value={body} />
            {updatedAt && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}
            <Reactions data={reactions} onChange={handleReaction} />
            <ThreadBar
              onClick={() => onOpenMessage(id)}
              count={threadCount}
              image={threadImage}
              name={threadName}
              timestamp={threadTimestamp}
            />
          </div>
        )}
      </div>
      {!isEditing && (
        <Toolbar
          isAuthor={isAuthor}
          isPending={isPending}
          handleEdit={() => setEditingId(id)}
          handleThread={() => onOpenMessage(id)}
          handleDelete={handleRemove}
          handleReaction={handleReaction}
          hideThreadButton={hideThreadButton}
        />
      )}
    </div>
  );
};
