import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { AlertTriangle, Loader, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useGetMessageByIdById } from "@/features/messages/api/use-get-message";
import { Message } from "@/components/message/message";
import { useCurentMemberShip } from "@/features/members/api/use-current-membership";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkSpaceId();

  const [editing, setEditing] = useState<Id<"messages"> | null>(null);

  const { data: currentMember, isLoading: memberLoading } = useCurentMemberShip(
    { workspaceId }
  );
  const { data: message, isLoading: messageLoading } = useGetMessageByIdById({
    id: messageId,
  });

  if (messageLoading || memberLoading) {
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
      <div className="mt-1">
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
    </div>
  );
};
