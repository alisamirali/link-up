import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  memberName?: string;
  memberImage?: string;
};

export function ConversationHero({
  memberName = "Member",
  memberImage,
}: Props) {
  return (
    <div className="mt-[50px] mx-5 mb-4">
      <div className="flex items-center gap-x-1 mb-2">
        <Avatar className="size-10 mr-1">
          <AvatarImage src={memberImage} />
          <AvatarFallback className="bg-sky-500 text-white text-xl">
            {memberName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">{memberName}</h2>
      </div>
      <p className="font-normal text-slate-800 mb-4">
        This conversation is between you and <strong>{memberName}</strong>.
      </p>
    </div>
  );
}
