"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetConversations } from "@/features/conversations/api";
import { useWorkspaceId } from "@/hooks";
import { formatDistanceToNow } from "date-fns";
import { Loader, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function DMsPage() {
  const workspaceId = useWorkspaceId();
  const { data: conversations, isLoading } = useGetConversations({
    workspaceId,
  });

  if (isLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-y-2">
        <Loader className="size-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-y-2">
        <MessageCircle className="size-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-foreground">
          No direct messages yet
        </h2>
        <p className="text-sm text-muted-foreground">
          Start a conversation by clicking on a member in the sidebar
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <header className="bg-white border-b h-[50px] flex items-center px-6">
        <h1 className="text-lg font-semibold">Direct Messages</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col">
          {conversations.map((conversation) => {
            const otherMember = conversation.otherMember;
            if (!otherMember) return null;

            const lastMessage = conversation.lastMessage;
            const lastMessageTime = lastMessage
              ? formatDistanceToNow(new Date(lastMessage._creationTime), {
                  addSuffix: true,
                })
              : null;

            return (
              <Link
                key={conversation._id}
                href={`/workspace/${workspaceId}/member/${otherMember._id}`}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto py-3 px-4 rounded-none hover:bg-accent/50"
                >
                  <Avatar className="size-10 mr-3">
                    <AvatarImage src={otherMember.user?.image} />
                    <AvatarFallback className="bg-sky-500 text-white">
                      {otherMember.user?.name?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex flex-col items-start min-w-0">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold text-sm truncate">
                        {otherMember.user?.name || "Unknown"}
                      </span>
                      {lastMessageTime && (
                        <span className="text-xs text-muted-foreground ml-2 shrink-0">
                          {lastMessageTime}
                        </span>
                      )}
                    </div>
                    {lastMessage && (
                      <span className="text-sm text-muted-foreground truncate w-full">
                        {lastMessage.body}
                      </span>
                    )}
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
