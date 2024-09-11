"use client";
import { useRouter } from "next/navigation";
import { useGetWorkSpaceById } from "@/features/workspaces/api/use-get-workspace-id";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCreateWorkSpaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { Loader, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const WorkSpaceSwitcher = () => {
  const router = useRouter();
  const workSpaceId = useWorkSpaceId();
  const [_open, setOpen] = useCreateWorkSpaceModal();
  const { data: workspace, isLoading: workspaceLoading } =
    useGetWorkSpaceById(workSpaceId);

  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();

  const filteredWorkspaces = workspaces?.filter(
    (workspace) => workspace._id !== workSpaceId
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD0/80 text-slate-800 font-semibold text-xl">
          {workspaceLoading ? (
            <Loader className="size-5 animate-spin shrink-0" />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${workspace?._id}`)}
          className="cursor-pionter flex-col justify-start items-start capitalize"
        >
          {workspace?.name}
          <span className="text-xs text-muted-foreground">
            Active Workspace
          </span>
        </DropdownMenuItem>
        <Separator />
        {filteredWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace._id}
            className="cursor-pionter flex-row justify-start items-center capitalize group"
            onClick={() => router.push(`/workspace/${workspace?._id}`)}
          >
            <div className="size-9 relative overflow-hidden bg-[#616061]/90 group-hover:bg-[#616061] transition text-white font-semibold text-lg rounded-md flex items-center justify-center mr-2">
              {workspace?.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm ml-2">{workspace.name}</span>
          </DropdownMenuItem>
        ))}
        <Separator />
        <DropdownMenuItem
          className="cursor-pionter flex-row justify-start items-center capitalize group"
          onClick={() => setOpen(true)}
        >
          <div className="size-9 relative overflow-hidden bg-[#F2F2F2] group-hover:bg-black/20 transition text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
            <Plus />
          </div>
          <span className="text-sm ml-2">Create a new workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
