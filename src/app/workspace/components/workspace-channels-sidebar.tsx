import { WorkspaceHeader } from "@/app/workspace/components";
import { Hint } from "@/components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetChannels } from "@/features/channels/api";
import { useCreateChannelModal } from "@/features/channels/store";
import { useCurrentMember, useGetMembers } from "@/features/members/api";
import { useGetWorkspace } from "@/features/workspaces/api";
import { useWorkspaceId } from "@/hooks";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  LucideIcon,
  MessageSquareText,
  PlusIcon,
  SendHorizontal,
} from "lucide-react";
import Link from "next/link";
import { FaCaretDown } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import { useToggle } from "react-use";
import { Id } from "../../../../convex/_generated/dataModel";

export function WorkspaceChannelsSidebar() {
  const workspaceId = useWorkspaceId();
  const [_open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: isLoadingMember } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetWorkspace(workspaceId);
  const { data: channels, isLoading: isLoadingChannels } = useGetChannels({
    workspaceId,
  });
  const { data: members, isLoading: isMembersLoading } = useGetMembers({
    workspaceId,
  });

  if (isLoadingMember || isLoadingWorkspace || isLoadingChannels) {
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

      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem
          label="Drafts & Sent"
          icon={SendHorizontal}
          id="drafts-and-sent"
        />
      </div>

      <WorkspaceSection
        label="Channels"
        hint="New Channel"
        onNew={member.role === "admin" ? () => setOpen(true) : undefined}
      >
        {channels?.map((channel) => (
          <SidebarItem
            key={channel._id}
            label={channel.name}
            icon={HashIcon}
            id={channel._id}
          />
        ))}
      </WorkspaceSection>

      <WorkspaceSection
        label="Direct Messages"
        hint="New Direct Message"
        onNew={() => {}}
      >
        {members?.map((member) => (
          <UserItem
            key={member._id}
            id={member._id}
            label={member?.user?.name}
            image={member?.user?.image}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
}

const sidebarItemVariants = cva(
  "flex items-center gap-x-1.5 justify-start font-normal h-9 px-[18px] text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#F9EdFFCC]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type SidebarItemProps = {
  label: string;
  icon: LucideIcon | IconType;
  id: string;
  variant?: VariantProps<typeof sidebarItemVariants>["variant"];
};

function SidebarItem({ label, icon: Icon, id, variant }: SidebarItemProps) {
  const workspaceId = useWorkspaceId();

  return (
    <Button
      asChild
      variant="transparent"
      size="sm"
      className={cn(sidebarItemVariants({ variant }))}
    >
      <Link href={`/workspaces/${workspaceId}/channel/${id}`}>
        <Icon className="size-4 mr-1 shrink-0" />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
}

type WorkspaceSectionProps = {
  label: string;
  hint: string;
  onNew?: () => void;
  children: React.ReactNode;
};

function WorkspaceSection({
  label,
  hint,
  onNew,
  children,
}: WorkspaceSectionProps) {
  const [on, toggle] = useToggle(true);

  return (
    <div className="flex flex-col mt-3 px-2">
      <div className="flex items-center px-3.5 group">
        <Button
          variant="transparent"
          className="p-0.5 text-sm text-[#F9EdFFCC] shrink-0 size-6"
          onClick={toggle}
        >
          <FaCaretDown
            className={cn("size-4 transition-transform", on && "-rotate-90")}
          />
        </Button>
        <Button
          variant="transparent"
          size="sm"
          className="group px-1.5 text-sm text-[#F9EdFFCC] h-[28px] justify-start overflow-hidden items-center"
        >
          <span className="truncate">{label}</span>
        </Button>

        {onNew && (
          <Hint label={hint} side="top" align="center">
            <Button
              onClick={onNew}
              variant="transparent"
              size="iconSm"
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-[#F9EdFFCC] size-6 shrink-0"
            >
              <PlusIcon className="size-5" />
            </Button>
          </Hint>
        )}
      </div>
      {on && children}
    </div>
  );
}

const userItemVariants = cva(
  "flex items-center gap-x-1.5 justify-start font-normal h-9 px-4 text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#F9EdFFCC]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type UserItemProps = {
  id: Id<"members">;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>["variant"];
};

function UserItem({ id, label, image, variant }: UserItemProps) {
  const workspaceId = useWorkspaceId();

  return (
    <Button
      variant="transparent"
      className={cn(userItemVariants({ variant }))}
      size="sm"
      asChild
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className="size-5 rounded-md mr-1">
          <AvatarImage className="rounded-md" src={image} />
          <AvatarFallback className="rounded-md bg-sky-500 text-white text-xs">
            {label?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
}
