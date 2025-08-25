"use client";

import { ChannelHero, Message } from "@/components";
import { useCurrentMember } from "@/features/members/api";
import { GetMessagesReturnType } from "@/features/messages/api";
import { useWorkspaceId } from "@/hooks";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

type Props = {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessagesReturnType | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
};

const TIME_THRESHOLD = 5;

const formateDateLabel = (dateString: string) => {
  const date = new Date(dateString);

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";

  return format(date, "EEE, MMMM d");
};

export function MessagesList({
  channelName,
  data,
  loadMore,
  isLoadingMore,
  canLoadMore,
  channelCreationTime,
  variant = "channel",
  memberImage,
  memberName,
}: Props) {
  const workspaceId = useWorkspaceId();
  const prevMessageCountRef = useRef<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data: currentMember } = useCurrentMember({ workspaceId });
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const groupedMessages = data?.reduce(
    (groups, message) => {
      const date = new Date(message?._creationTime!);
      const dateKey = format(date, "yyyy-MM-dd");

      if (!groups[dateKey]) groups[dateKey] = [];

      groups[dateKey].unshift(message);

      return groups;
    },
    {} as Record<string, typeof data>
  );

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    const currentMessageCount = data?.length || 0;
    const prevMessageCount = prevMessageCountRef.current;

    // Only auto-scroll if new messages were added (not on initial load)
    if (currentMessageCount > prevMessageCount && prevMessageCount > 0) {
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        // Use requestAnimationFrame to ensure DOM is updated
        requestAnimationFrame(() => {
          scrollContainer.scrollTop = 0; // Since we're using flex-col-reverse, scrollTop = 0 shows the bottom
        });
      }
    }

    prevMessageCountRef.current = currentMessageCount;
  }, [data?.length]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 flex flex-col-reverse pb-5 overflow-y-auto messages-scrollbar"
    >
      {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="text-center my-2 relative ">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              {formateDateLabel(dateKey)}
            </span>
          </div>

          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];

            const isCompact =
              prevMessage &&
              prevMessage.user?._id === message?.user?._id &&
              differenceInMinutes(
                new Date(message?._creationTime),
                new Date(prevMessage?._creationTime)
              ) < TIME_THRESHOLD;

            return (
              <Message
                key={message?._id}
                id={message?._id!}
                memberId={message?.memberId!}
                authorImage={message?.user.image}
                authorName={message?.user.name}
                reactions={message?.reactions!}
                body={message?.body!}
                image={message?.image}
                updatedAt={message?.updatedAt}
                createdAt={message?._creationTime!}
                threadCount={message?.threadCount}
                threadImage={message?.threadImage}
                threadTimestamp={message?.threadTimestamp}
                isEditing={editingId === message?._id}
                setEditingId={setEditingId}
                isCompact={isCompact!}
                hideThreadButton={variant === "thread"}
                isAuthor={message?.memberId === currentMember?._id}
              />
            );
          })}
        </div>
      ))}

      {variant === "channel" && channelName && channelCreationTime && (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      )}
    </div>
  );
}
