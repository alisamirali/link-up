import { MessagesList } from "@/components";
import { useGetMember } from "@/features/members/api";
import { useGetMessages } from "@/features/messages/api";
import { useMemberId } from "@/hooks";
import { Loader } from "lucide-react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { ChatInput } from "../components/chat-input";
import { ConversationHeader } from "./conversation-header";

type Props = {
  id: Id<"conversations">;
};

export function Conversation({ id }: Props) {
  const memberId = useMemberId();
  const { data: member, isLoading: isMemberLoading } = useGetMember({
    id: memberId,
  });
  const { results, status, loadMore } = useGetMessages({
    conversationId: id,
  });

  if (isMemberLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader
        memberName={member?.user?.name}
        memberImage={member?.user?.image}
        onClick={() => {}}
      />

      <MessagesList
        data={results}
        variant="conversation"
        memberImage={member?.user?.image}
        memberName={member?.user?.name}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status !== "CanLoadMore"}
      />

      <ChatInput
        conversationId={id}
        placeholder={`Message ${member?.user?.name}...`}
      />
    </div>
  );
}
