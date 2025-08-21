import { Hint } from "@/components";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import { Doc } from "../../../../convex/_generated/dataModel";

type WorkspaceHeaderProps = {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
};

export function WorkspaceHeader({ workspace, isAdmin }: WorkspaceHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 h-[50px] gap-0.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="transparent"
            className="font-semibold text-lg w-auto p-1.5 overflow-hidden"
            size="sm"
          >
            <span className="truncate">{workspace?.name}</span>
            <ChevronDown className="size-5 ml-1 shrink-0" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="start" className="w-64">
          <DropdownMenuItem className="cursor-pointer capitalize">
            <div className="size-9 relative overflow-hidden bg-gray-300 text-xl rounded-md flex items-center justify-center">
              {workspace?.emoji}
            </div>
            <div className="flex flex-col items-start">
              <p className="font-bold">{workspace?.name}</p>
              <p className="text-xs text-muted-foreground">Active Workspace</p>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {isAdmin && (
            <>
              <DropdownMenuItem
                className="cursor-pointer py-2"
                onClick={() => {}}
              >
                Invite people to {workspace?.name}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer py-2"
                onClick={() => {}}
              >
                Preferences
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>

        <div className="flex items-center gap-0.5">
          <Hint label="Filter channels" side="bottom">
            <Button variant="transparent" size="iconSm">
              <ListFilter className="size-5" />
            </Button>
          </Hint>
          <Hint label="New message" side="bottom">
            <Button variant="transparent" size="iconSm">
              <SquarePen className="size-5" />
            </Button>
          </Hint>
        </div>
      </DropdownMenu>
    </div>
  );
}
