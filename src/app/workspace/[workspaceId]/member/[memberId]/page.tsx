"use client";

import { useCreateOrGetConversation } from "@/features/conversations/api";
import { useMemberId, useWorkspaceId } from "@/hooks";
import { AlertTriangle, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { Conversation } from "../components/conversation";

export default function MemberIdPage() {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useCreateOrGetConversation();
  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);

  useEffect(() => {
    if (!workspaceId || !memberId) {
      toast.error("Missing workspace or member ID");
      return;
    }

    mutate(
      {
        workspaceId,
        memberId,
      },
      {
        onSuccess: (data) => {
          setConversationId(data);
        },
        onError: (error) => {
          console.error("Conversation creation error:", error);
          toast.error("Failed to create conversation");
        },
      }
    );
  }, [mutate, memberId, workspaceId]);

  if (isPending) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-y-2">
        <AlertTriangle className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Conversation not found</p>
      </div>
    );
  }

  return <Conversation id={conversationId} />;
}
