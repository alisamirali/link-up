import { Message } from "@/components";
import { Button } from "@/components/ui/button";
import { useCurrentMember } from "@/features/members/api";
import { useGetMessage } from "@/features/messages/api";
import { useWorkspaceId } from "@/hooks";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type Props = {
  messageId: Id<"messages">;
  onClose: () => void;
};

export function Thread({ messageId, onClose }: Props) {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const { data: message, isLoading: isMessageLoading } = useGetMessage({
    id: messageId,
  });

  if (isMessageLoading) {
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

      <div>
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
    </div>
  );
}
