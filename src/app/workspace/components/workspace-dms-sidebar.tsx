import { WorkspaceHeader } from "@/app/workspace/components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetConversations } from "@/features/conversations/api";
import { useCurrentMember, useGetMembers } from "@/features/members/api";
import { useGetWorkspace } from "@/features/workspaces/api";
import { useMemberId, useWorkspaceId } from "@/hooks";
import { extractTextFromQuillDelta } from "@/lib/quill-utils";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, Loader } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Id } from "../../../../convex/_generated/dataModel";

export function WorkspaceDmsSidebar() {
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();

  const { data: member, isLoading: isLoadingMember } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetWorkspace(workspaceId);
  const { data: conversations, isLoading: isLoadingConversations } =
    useGetConversations({ workspaceId });

  if (isLoadingMember || isLoadingWorkspace || isLoadingConversations) {
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

      <div className="flex-1 overflow-y-auto mt-3">
        <div className="flex flex-col px-2">
          {!conversations || conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <p className="text-sm text-[#F9EdFFCC]">
                No direct messages yet
              </p>
            </div>
          ) : (
            conversations.map((conversation) => {
              const otherMember = conversation.otherMember;
              if (!otherMember) return null;

              const lastMessage = conversation.lastMessage;
              const lastMessagePreview = lastMessage
                ? extractTextFromQuillDelta(lastMessage.body)
                : null;
              const lastMessageTime = lastMessage
                ? formatDistanceToNow(new Date(lastMessage._creationTime), {
                    addSuffix: true,
                  })
                : null;

              const isActive = otherMember._id === memberId;

              return (
                <DmItem
                  key={conversation._id}
                  id={otherMember._id}
                  label={otherMember.user?.name || "Unknown"}
                  image={otherMember.user?.image}
                  preview={lastMessagePreview}
                  time={lastMessageTime}
                  variant={isActive ? "active" : "default"}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

const dmItemVariants = cva(
  "flex items-center gap-x-2 justify-start font-normal h-auto py-2 px-3 text-sm overflow-hidden rounded-md",
  {
    variants: {
      variant: {
        default: "text-[#F9EdFFCC] hover:bg-white/5",
        active: "text-white font-semibold bg-white/10 hover:bg-white/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type DmItemProps = {
  id: Id<"members">;
  label: string;
  image?: string;
  preview?: string | null;
  time?: string | null;
  variant?: VariantProps<typeof dmItemVariants>["variant"];
};

function DmItem({
  id,
  label,
  image,
  preview,
  time,
  variant,
}: DmItemProps) {
  const workspaceId = useWorkspaceId();

  return (
    <Button
      variant="transparent"
      className={cn(dmItemVariants({ variant }))}
      size="sm"
      asChild
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className="size-8 shrink-0">
          <AvatarImage src={image} />
          <AvatarFallback className="bg-sky-500 text-white text-xs">
            {label?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 flex flex-col items-start min-w-0">
          <div className="flex items-center justify-between w-full gap-2">
            <span className="text-sm font-medium truncate">{label}</span>
            {time && (
              <span className="text-xs text-muted-foreground shrink-0">
                {time}
              </span>
            )}
          </div>
          {preview && (
            <span className="text-xs text-muted-foreground truncate w-full">
              {preview}
            </span>
          )}
        </div>
      </Link>
    </Button>
  );
}
