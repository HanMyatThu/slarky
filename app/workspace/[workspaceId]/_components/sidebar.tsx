import { UserButton } from "@/components/common/user-button";
import { WorkSpaceSwitcher } from "./workspace-switcher";
import { SidebarButton } from "./sidebar-button";
import { BellIcon, Home, MessageSquare, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

const SideBarMenus = [
  {
    icon: Home,
    label: "Home",
    href: "/workspace",
  },
  {
    icon: MessageSquare,
    label: "DMs",
    href: "/direct-message",
  },
  {
    icon: BellIcon,
    label: "Activity",
    href: "/activity",
  },
  {
    icon: MoreHorizontal,
    label: "More",
    href: "/settings",
  },
];

export const Sidebar = () => {
  const pathName = usePathname();

  return (
    <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-[8px]">
      <WorkSpaceSwitcher />
      {SideBarMenus.map((menu) => (
        <SidebarButton
          key={menu.label}
          label={menu.label}
          icon={menu.icon}
          isActive={pathName.includes(menu.href)}
        />
      ))}
      <div className="flex flex-col items-center gap-y-1 mt-auto justify-center">
        <UserButton />
      </div>
    </aside>
  );
};
