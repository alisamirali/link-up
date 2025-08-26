import { Message } from "@/components";
import { Button } from "@/components/ui/button";
import { useCurrentMember } from "@/features/members/api";
import {
  useCreateMessage,
  useGetMessage,
  useGetMessages,
} from "@/features/messages/api";
import { useGenerateUploadUrl } from "@/features/upload/api";
import { useChannelId, useWorkspaceId } from "@/hooks";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";

const Editor = dynamic(
  () => import("@/components/editor").then((mod) => mod.Editor),
  {
    ssr: false,
  }
);

type Props = {
  messageId: Id<"messages">;
  onClose: () => void;
};

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  parentMessageId: Id<"messages">;
  body: string;
  image: Id<"_storage"> | undefined;
};

const TIME_THRESHOLD = 5;

const formateDateLabel = (dateString: string) => {
  const date = new Date(dateString);

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";

  return format(date, "EEE, MMMM d");
};

export function Thread({ messageId, onClose }: Props) {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const { data: message, isLoading: isMessageLoading } = useGetMessage({
    id: messageId,
  });
  const { results, status, loadMore } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);
  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";

  const handleSubmit = async ({
    image,
    body,
  }: {
    image: File | null;
    body: string;
  }) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);

      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        parentMessageId: messageId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) throw new Error("Url not found!");

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) throw new Error("Failed to upload image");

        const { storageId } = await result.json();

        values.image = storageId;
      }

      await createMessage(values, {
        throwError: true,
      });

      setEditorKey((prev) => prev + 1);
    } catch {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  };

  const groupedMessages = results?.reduce(
    (groups, message) => {
      const date = new Date(message?._creationTime!);
      const dateKey = format(date, "yyyy-MM-dd");

      if (!groups[dateKey]) groups[dateKey] = [];

      groups[dateKey].unshift(message);

      return groups;
    },
    {} as Record<string, typeof results>
  );

  if (isMessageLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[50px] border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-6 stroke-[1.5]" />
          </Button>
        </div>

        <div className="flex h-full flex-col gap-y-2 items-center justify-center">
          <Loader className="size-8 text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[50px] border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-6 stroke-[1.5]" />
          </Button>
        </div>

        <div className="flex h-full flex-col gap-y-2 items-center justify-center">
          <AlertTriangle className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Message not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-4 h-[50px] border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-6 stroke-[1.5]" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col-reverse pb-5 overflow-y-auto messages-scrollbar">
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
                  threadName={message?.threadName}
                  threadTimestamp={message?.threadTimestamp}
                  isEditing={editingId === message?._id}
                  setEditingId={setEditingId}
                  isCompact={isCompact!}
                  hideThreadButton
                  isAuthor={message?.memberId === currentMember?._id}
                />
              );
            })}
          </div>
        ))}

        <div
          className="h-1 "
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && canLoadMore) {
                    loadMore();
                  }
                },
                {
                  threshold: 1.0,
                }
              );

              observer.observe(el);

              return () => observer.disconnect();
            }
          }}
        />

        {isLoadingMore && (
          <div className="text-center my-2 relative ">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              <Loader className="animate-spin size-5" />
            </span>
          </div>
        )}

        <Message
          hideThreadButton
          memberId={message.memberId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={message.memberId === currentMember?._id}
          body={message.body}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          isCompact={false}
          id={message._id}
          reactions={message.reactions}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
        />
      </div>

      <div className="px-4">
        <Editor
          key={editorKey}
          onSubmit={handleSubmit}
          disabled={isPending}
          innerRef={editorRef}
          placeholder="Reply..."
        />
      </div>
    </div>
  );
}
