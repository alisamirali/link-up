"use client";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useGetChannels } from "@/features/channels/api";
import { useGetMembers } from "@/features/members/api";
import { useGetWorkspace } from "@/features/workspaces/api";
import { useWorkspaceId } from "@/hooks";
import { Info, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Toolbar() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [openSearch, setOpenSearch] = useState(false);
  const { data: workspace } = useGetWorkspace(workspaceId);
  const { data: members } = useGetMembers({ workspaceId });
  const { data: channels } = useGetChannels({ workspaceId });

  const onChannelClick = (channelId: string) => {
    setOpenSearch(false);

    router.push(`/workspace/${workspaceId}/channel/${channelId}`);
  };

  const onMemberClick = (memberId: string) => {
    setOpenSearch(false);

    router.push(`/workspace/${workspaceId}/member/${memberId}`);
  };

  return (
    <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />

      <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
        <Button
          size="sm"
          onClick={() => setOpenSearch(true)}
          className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2"
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {workspace?.name}</span>
        </Button>

        <CommandDialog open={openSearch} onOpenChange={setOpenSearch}>
          <CommandInput placeholder="Search across members, channels..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem
                  key={channel._id}
                  className="cursor-pointer"
                  onSelect={() => onChannelClick(channel._id)}
                >
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem
                  key={member._id}
                  className="cursor-pointer"
                  onSelect={() => onMemberClick(member._id)}
                >
                  {member.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>

      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
}
