import { SidebarButton, WorkspaceSwitcher } from "@/app/workspace/components";
import { UserButton } from "@/features/auth/components";
import { useWorkspaceId } from "@/hooks";
import { Bell, Home, MessageCircle, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();

  return (
    <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pb-4">
      <WorkspaceSwitcher />

      <SidebarButton
        icon={Home}
        label="Home"
        isActive={pathname.includes("/workspace") && !pathname.includes("/dms")}
        href={`/workspace/${workspaceId}`}
      />
      <SidebarButton
        icon={MessageCircle}
        label="DMs"
        isActive={pathname.includes("/dms")}
        href={`/workspace/${workspaceId}/dms`}
      />
      <SidebarButton icon={Bell} label="Activity" />
      <SidebarButton icon={MoreHorizontal} label="More" />

      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
}
