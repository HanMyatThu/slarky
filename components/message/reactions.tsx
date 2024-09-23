import { MdOutlineAddReaction } from "react-icons/md";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useCurentMemberShip } from "@/features/members/api/use-current-membership";

import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ToolTipHint } from "@/components/common/tooltip-hint";
import { EmojiPopver } from "@/components/common/emoji-popover";

interface ReactionsProps {
  data: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  onChange: (value: string) => void;
}

export const Reactions = ({ data, onChange }: ReactionsProps) => {
  const workspaceId = useWorkSpaceId();
  const { data: currentMember } = useCurentMemberShip({ workspaceId });

  const currentMemberId = currentMember?._id;

  if (data.length === 0 || !currentMemberId) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 mt-1 mb-1">
      {data.map((reaction) => (
        <ToolTipHint
          key={reaction._id}
          label={`${reaction.count} ${reaction.count === 1 ? "person" : "people"} reacted with ${reaction.value}`}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange(reaction.value)}
            className={cn(
              "h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-1",
              reaction.memberIds.includes(currentMemberId) &&
                "bg-blue-100/70 border-blue-500 text-blue-500"
            )}
          >
            {reaction.value}
            <span
              className={cn(
                "text-xs font-semibold text-muted-foreground",
                reaction.memberIds.includes(currentMemberId) && "text-blue-500"
              )}
            >
              {reaction.count}
            </span>
          </Button>
        </ToolTipHint>
      ))}
      <EmojiPopver
        hint="Add reaction"
        onEmojiSelect={(emoji) => onChange(emoji)}
      >
        <button className="h-6 px-3 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 text-slate-800 items-center gap-1">
          <MdOutlineAddReaction className="size-4" />
        </button>
      </EmojiPopver>
    </div>
  );
};
