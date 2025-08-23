"use client";

import { useGetChannel } from "@/features/channels/api";
import { useChannelId } from "@/hooks";
import { Loader, TriangleAlert } from "lucide-react";
import { ChannelHeader, ChatInput } from "../components";

export default function ChannelPage() {
  const channelId = useChannelId();
  const { data: channel, isLoading: isChannelLoading } = useGetChannel({
    id: channelId,
  });

  if (isChannelLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="size-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-y-2">
        <TriangleAlert className="size-8 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Channel not found!
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChannelHeader name={channel.name} />
      <div className="flex-1" />
      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  );
}
