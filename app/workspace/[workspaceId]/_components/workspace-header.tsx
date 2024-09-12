import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import { useState } from "react";

import { ToolTipHint } from "@/components/common/tooltip-hint";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Doc } from "@/convex/_generated/dataModel";
import { PreferencesModal } from "./preferences-modal";

interface WorkspaceHeaderProps {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
}

export const WorkSpaceHeader = ({
  workspace,
  isAdmin,
}: WorkspaceHeaderProps) => {
  const [preferenceOpen, setPreferenceOpen] = useState(false);
  return (
    <>
      <PreferencesModal
        open={preferenceOpen}
        setOpen={setPreferenceOpen}
        initialValue={workspace.name}
      />
      <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="transparent"
              className="font-semibold text-[16px] w-auto p-1.5 overflow-hidden"
              size="sm"
            >
              <span className="truncate">{workspace.name}</span>
              <ChevronDown className="size-4 ml-1 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start" className="w-64">
            <DropdownMenuItem className="cursor-pointer capitalize gap-x-2">
              <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col items-start">
                <p className="font-bold">{workspace.name}</p>
                <p className="text-xs text-muted-foreground">Active Work</p>
              </div>
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={() => {}}
                >
                  Invite People to {workspace.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={() => setPreferenceOpen(true)}
                >
                  Preferences
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-0.5">
          <ToolTipHint label="Filter Conversation" side="bottom">
            <Button variant="transparent" size="iconSm">
              <ListFilter className="size-4" />
            </Button>
          </ToolTipHint>
          <ToolTipHint label="New Message" side="bottom">
            <Button variant="transparent" size="iconSm">
              <SquarePen className="size-4" />
            </Button>
          </ToolTipHint>
        </div>
      </div>
    </>
  );
};
