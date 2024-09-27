import { MessageSquareText, PencilIcon, Smile, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToolTipHint } from "@/components/common/tooltip-hint";
import { EmojiPopver } from "@/components/common/emoji-popover";
import { ConfirmationModal } from "../common/confirmation-modal";

interface ToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
}

export const Toolbar = ({
  handleDelete,
  handleEdit,
  handleReaction,
  handleThread,
  hideThreadButton,
  isAuthor,
  isPending,
}: ToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopver
          hint="Add reaction"
          onEmojiSelect={(emoji) => handleReaction(emoji)}
        >
          <Button variant="ghost" size="iconSm" disabled={isPending}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopver>
        {!hideThreadButton && (
          <ToolTipHint label="Thread">
            <Button
              variant="ghost"
              size="iconSm"
              disabled={isPending}
              onClick={handleThread}
            >
              <MessageSquareText className="size-4" />
            </Button>
          </ToolTipHint>
        )}
        {isAuthor && (
          <>
            <ToolTipHint label="Edit message">
              <Button
                variant="ghost"
                size="iconSm"
                disabled={isPending}
                onClick={handleEdit}
              >
                <PencilIcon className="size-4" />
              </Button>
            </ToolTipHint>
            <ConfirmationModal
              label="Are you sure to delete this message?"
              description="This action cannot be undone."
              confirmText="delete-message"
              onConfirm={handleDelete}
            >
              <Button variant="ghost" size="iconSm" disabled={isPending}>
                <Trash className="size-4" />
              </Button>
            </ConfirmationModal>
          </>
        )}
      </div>
    </div>
  );
};
