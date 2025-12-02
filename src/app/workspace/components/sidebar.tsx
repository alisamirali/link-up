import { SidebarButton, WorkspaceSwitcher } from "@/app/workspace/components";
import { UserButton } from "@/features/auth/components";
import { useWorkspaceId } from "@/hooks";
import { Bookmark, Home, MessageCircle } from "lucide-react";
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
        isActive={
          pathname.includes("/workspace") &&
          !pathname.includes("/dms") &&
          !pathname.includes("/member")
        }
        href={`/workspace/${workspaceId}`}
      />
      <SidebarButton
        icon={MessageCircle}
        label="DMs"
        isActive={pathname.includes("/dms") || pathname.includes("/member")}
        href={`/workspace/${workspaceId}/dms`}
      />
      <SidebarButton icon={Bookmark} label="Later" />
      {/* <SidebarButton icon={MoreHorizontal} label="More" /> */}

      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
}
