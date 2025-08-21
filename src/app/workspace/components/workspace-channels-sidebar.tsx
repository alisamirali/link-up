import { WorkspaceHeader } from "@/app/workspace/components";
import { useCurrentMember } from "@/features/members/api";
import { useGetWorkspace } from "@/features/workspaces/api";
import { useWorkspaceId } from "@/hooks";
import { AlertTriangle, Loader } from "lucide-react";

export function WorkspaceChannelsSidebar() {
  const workspaceId = useWorkspaceId();
  const { data: member, isLoading: isLoadingMember } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetWorkspace(workspaceId);

  if (isLoadingMember || isLoadingWorkspace) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-[#5E2C5F]">
        <Loader className="animate-spin size-8 text-white" />
      </div>
    );
  }

  if (!member || !workspace) {
    return (
      <div className="flex flex-col gap-y-2 h-full items-center justify-center bg-[#5E2C5F]">
        <AlertTriangle className="size-8 text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#5E2C5F]">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
    </div>
  );
}
