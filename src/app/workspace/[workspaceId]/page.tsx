"use client";

import { useGetChannels } from "@/features/channels/api";
import { useCreateChannelModal } from "@/features/channels/store";
import { useCurrentMember } from "@/features/members/api";
import { useGetWorkspace } from "@/features/workspaces/api";
import { useWorkspaceId } from "@/hooks";
import { Loader, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function WorkspacePage() {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const [open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: isMemberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: isWorkspaceLoading } =
    useGetWorkspace(workspaceId);
  const { data: channels, isLoading: isChannelsLoading } = useGetChannels({
    workspaceId,
  });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);

  useEffect(() => {
    if (
      isWorkspaceLoading ||
      isChannelsLoading ||
      isMemberLoading ||
      !workspace ||
      !member
    )
      return;

    if (channelId)
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    else if (!open && isAdmin) setOpen(true);
  }, [
    channelId,
    channels,
    workspace,
    isAdmin,
    member,
    isWorkspaceLoading,
    isChannelsLoading,
    isMemberLoading,
    open,
    setOpen,
    router,
    workspaceId,
  ]);

  if (isWorkspaceLoading || isChannelsLoading || isMemberLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-y-2">
        <Loader className="size-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-y-2">
        <TriangleAlert className="size-8 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace not found!
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex items-center justify-center flex-col gap-y-2">
      <TriangleAlert className="size-8 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">No channel found</span>
    </div>
  );
}
