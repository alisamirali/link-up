"use client";

import { useGetConversations } from "@/features/conversations/api";
import { useWorkspaceId } from "@/hooks";
import { Loader, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DMsPage() {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { data: conversations, isLoading } = useGetConversations({
    workspaceId,
  });

  useEffect(() => {
    if (isLoading) return;

    // If there are conversations, redirect to the first one
    if (conversations && conversations.length > 0) {
      const firstConversation = conversations[0];
      const otherMember = firstConversation.otherMember;
      if (otherMember) {
        router.replace(`/workspace/${workspaceId}/member/${otherMember._id}`);
      }
    }
  }, [conversations, isLoading, router, workspaceId]);

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

  // Show loading while redirecting
  return (
    <div className="h-full flex-1 flex items-center justify-center flex-col gap-y-2">
      <Loader className="size-8 text-muted-foreground animate-spin" />
    </div>
  );
}
