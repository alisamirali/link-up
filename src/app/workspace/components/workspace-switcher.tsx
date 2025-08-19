import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useGetWorkspace, useGetWorkspaces } from "@/features/workspaces/api";
import { useCreateWorkspaceModal } from "@/features/workspaces/store";
import { useWorkspaceId } from "@/hooks";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function WorkspaceSwitcher() {
  const [_open, setOpen] = useCreateWorkspaceModal();
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { data: workspace, isLoading: isWorkspaceLoading } =
    useGetWorkspace(workspaceId);
  const { data: workspaces, isLoading: isWorkspacesLoading } =
    useGetWorkspaces();

  const filteredWorkspaces = workspaces?.filter(
    (workspace) => workspace._id !== workspaceId
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          className="size-10 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl"
          title={workspace?.name}
        >
          {isWorkspaceLoading ? (
            <Loader className="size-5 animate-spin shrink-0" />
          ) : workspace?.emoji ? (
            workspace.emoji
          ) : (
            workspace?.name?.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          className="cursor-pointer flex flex-col justify-start items-start capitalize gap-1 overflow-hidden"
          onClick={() => router.push(`/workspace/${workspaceId}`)}
        >
          <div className="flex items-center gap-2 w-full overflow-hidden">
            <span className="text-base">{workspace?.emoji}</span>
            <p className="text-base truncate flex-1 min-w-0">
              {workspace?.name}
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            Active Workspace
          </span>
        </DropdownMenuItem>

        <Separator className="my-1" />

        {filteredWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace._id}
            className="cursor-pointer capitalize overflow-hidden"
            onClick={() => router.push(`/workspace/${workspace._id}`)}
          >
            <div className="flex items-center gap-2 w-full overflow-hidden">
              <span className="text-base">{workspace?.emoji}</span>
              <p className="text-base truncate flex-1 min-w-0">
                {workspace?.name}
              </p>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuItem
          className="cursor-pointer mt-1"
          onClick={() => setOpen(true)}
        >
          <div className="size-10 relative overflow-hidden bg-[#F2F2F2] text-slate-800 font-semibold text-xl rounded-md flex items-center justify-center mr-2">
            <Plus className="size-5" />
          </div>
          Add a workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
