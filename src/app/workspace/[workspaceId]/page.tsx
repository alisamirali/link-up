"use client";

import { useGetWorkspace } from "@/features/workspaces/api";
import { useWorkspaceId } from "@/hooks";

export default function WorkspacePage() {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspace(workspaceId);

  return <div>Workspace: {data?.name}</div>;
}
