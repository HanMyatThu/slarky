"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { Loader, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/features/auth/api/use-current-user";

export const UserButton = () => {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const { data, isLoading } = useCurrentUser();

  if (isLoading) {
    return <Loader className="size-4 animate-spin text-muted-foreground" />;
  }

  if (!data) {
    return null;
  }

  const { image, name, email } = data;

  const avatarFallBack = name!.charAt(0).toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition">
          <AvatarImage />
          <AvatarFallback className="bg-red-300">
            {avatarFallBack}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuItem className="h-10" onClick={() => signOut()}>
          <LogOut className="size-4 mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
