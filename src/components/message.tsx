"use client";

import dynamic from "next/dynamic";

import { Hint, Reactions, Thumbnail, Toolbar } from "@/components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDeleteMessage, useUpdateMessage } from "@/features/messages/api";
import { useToggleReaction } from "@/features/reactions/api";
import { usePanel } from "@/hooks";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { toast } from "sonner";
import { Doc, Id } from "../../convex/_generated/dataModel";

const Renderer = dynamic(
  () => import("@/components/renderer").then((mod) => mod.Renderer),
  {
    ssr: false,
  }
);

const Editor = dynamic(
  () => import("@/components/editor").then((mod) => mod.Editor),
  {
    ssr: false,
  }
);

type Props = {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
};

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};

export function Message({
  id,
  memberId,
  authorImage,
  authorName = "Member",
  isAuthor,
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimestamp,
}: Props) {
  const { onOpenMessage, onCloseMessage, parentMessageId } = usePanel();
  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();
  const { mutate: deleteMessage, isPending: isDeletingMessage } =
    useDeleteMessage();
  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction();

  const isPending =
    isUpdatingMessage || isDeletingMessage || isTogglingReaction;

  const handleToggleReaction = (reaction: string) => {
    toggleReaction(
      {
        messageId: id,
        value: reaction,
      },
      {
        onError: () => {
          toast.error("Failed to toggle reaction");
        },
      }
    );
  };

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      {
        id,
        body,
      },
      {
        onSuccess: () => {
          toast.success("Message updated successfully");
          setEditingId(null);
        },
        onError: () => {
          toast.error("Failed to update message");
        },
      }
    );
  };

  const handleDelete = () => {
    deleteMessage(
      {
        id,
      },
      {
        onSuccess: () => {
          toast.success("Message deleted successfully");
          setEditingId(null);

          if (parentMessageId === id) onCloseMessage();
        },
        onError: () => {
          toast.error("Failed to delete message");
        },
      }
    );
  };

  if (isCompact) {
    return (
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
          isDeletingMessage &&
            "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-300"
        )}
      >
        <div className="flex items-start gap-2">
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
              {format(new Date(createdAt), "hh:mm")}
            </button>
          </Hint>

          {isEditing ? (
            <div className="w-full h-full ">
              <Editor
                onSubmit={handleUpdate}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="edit"
              />
            </div>
          ) : (
            <div className="flex flex-col w-full ">
              <Renderer value={body} />
              <Thumbnail url={image} />

              {updatedAt && (
                <span className="text-xs text-muted-foreground">(edited)</span>
              )}

              <Reactions data={reactions} onChange={handleToggleReaction} />
            </div>
          )}
        </div>

        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleDelete}
            hideThreadButton={hideThreadButton}
            handleReaction={handleToggleReaction}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
        isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
        isDeletingMessage &&
          "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
      )}
    >
      <div className="flex items-start gap-2">
        <button>
          <Avatar>
            <AvatarImage src={authorImage} />
            <AvatarFallback className="bg-sky-500 text-white text-sm">
              {authorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>

        {isEditing ? (
          <div className="w-full h-full ">
            <Editor
              onSubmit={handleUpdate}
              disabled={isPending}
              defaultValue={JSON.parse(body)}
              onCancel={() => setEditingId(null)}
              variant="edit"
            />
          </div>
        ) : (
          <div className="flex flex-col w-full overflow-hidden">
            <div className="text-sm">
              <button className="font-semibold text-primary hover:underline">
                {authorName}
              </button>
              <span>&nbsp;&nbsp;</span>
              <Hint label={formatFullTime(new Date(createdAt))}>
                <button className="text-xs text-muted-foreground hover:underline">
                  {format(new Date(createdAt), "h:mm a")}
                </button>
              </Hint>
            </div>
            <Renderer value={body} />

            <Thumbnail url={image} />

            {updatedAt && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}

            <Reactions data={reactions} onChange={handleToggleReaction} />
          </div>
        )}
      </div>

      {!isEditing && (
        <Toolbar
          isAuthor={isAuthor}
          isPending={isPending}
          handleEdit={() => setEditingId(id)}
          handleThread={() => onOpenMessage(id)}
          handleDelete={handleDelete}
          hideThreadButton={hideThreadButton}
          handleReaction={handleToggleReaction}
        />
      )}
    </div>
  );
}
