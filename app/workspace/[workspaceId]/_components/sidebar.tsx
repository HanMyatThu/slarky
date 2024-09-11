import { UserButton } from "@/components/common/user-button";
import { WorkSpaceSwitcher } from "./workspace-switcher";

export const Sidebar = () => {
  return (
    <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-[8px]">
      <WorkSpaceSwitcher />
      <div className="flex flex-col items-center gap-y-1 mt-auto justify-center">
        <UserButton />
      </div>
    </aside>
  );
};
