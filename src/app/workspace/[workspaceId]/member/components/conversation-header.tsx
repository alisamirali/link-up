import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type Props = {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
};

export function ConversationHeader({
  memberName = "Member",
  memberImage,
  onClick,
}: Props) {
  return (
    <header className="bg-white  border-b h-[50px] flex items-center px-4 overflow-hidden">
      <Button
        variant="ghost"
        className="tex-lg font-semibold px-2 overflow-hidden w-auto"
        size="sm"
        onClick={onClick}
      >
        <Avatar className="size-6">
          <AvatarImage src={memberImage} />
          <AvatarFallback className="bg-sky-500 text-white text-sm">
            {memberName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="truncate">{memberName}</span>
      </Button>
    </header>
  );
}
