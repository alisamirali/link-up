import { useMemberProfileId } from "@/features/members/store";
import { useParentMessageId } from "@/features/messages/store";

export function usePanel() {
  const [parentMessageId, setParentMessageId] = useParentMessageId();
  const [memberProfileId, setProfileMemberId] = useMemberProfileId();

  const onOpenProfile = (memberId: string) => {
    setProfileMemberId(memberId);
    setParentMessageId(null);
  };

  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId);
    setProfileMemberId(null);
  };

  const onCloseMessage = () => {
    setParentMessageId(null);
    setProfileMemberId(null);
  };

  return {
    parentMessageId,
    onOpenMessage,
    onCloseMessage,
    memberProfileId,
    onOpenProfile,
  };
}
