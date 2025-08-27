import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetMember } from "@/features/members/api";
import { useWorkspaceId } from "@/hooks";
import {
  AlertTriangle,
  Loader,
  MailIcon,
  MessageCircle,
  Phone,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { Id } from "../../../../convex/_generated/dataModel";

type Props = {
  memberId: Id<"members">;
  onClose: () => void;
};

export function Profile({ memberId, onClose }: Props) {
  const workspaceId = useWorkspaceId();
  const { data: member, isLoading: isMemberLoading } = useGetMember({
    id: memberId,
  });

  if (isMemberLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[50px] border-b">
          <p className="text-lg font-bold">Profile</p>
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

  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[50px] border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-6 stroke-[1.5]" />
          </Button>
        </div>

        <div className="flex h-full flex-col gap-y-2 items-center justify-center">
          <AlertTriangle className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-4 h-[50px] border-b">
        <p className="text-lg font-bold">Profile</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-6 stroke-[1.5]" />
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center p-4">
        <Avatar className="max-w-[256px] max-h-[256px] size-full">
          <AvatarImage src={member.user.image} />
          <AvatarFallback className="bg-sky-500 text-white text-6xl aspect-square">
            {member.user.name?.[0].charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col p-4 text-center">
        <p className="text-xl font-bold">{member.user.name}</p>
      </div>

      <div className="flex items-center justify-center p-4">
        <Button
          asChild
          variant="ghost"
          className="w-full border border-border rounded-lg"
        >
          <Link href={`/workspace/${workspaceId}/member/${memberId}`}>
            <MessageCircle className="size-5" />
            Message
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="flex flex-col p-4">
        <p className="text-sm font-bold mb-4">Contact Info</p>
        <div className="flex items-center gap-2 mb-3">
          <div className="size-10 rounded-md bg-muted flex items-center justify-center">
            <MailIcon className="size-5" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-muted-foreground">
              Email Address
            </p>
            <Link
              href={`mailto:${member.user.email}`}
              className="text-base hover:underline text-[#1264a3]"
            >
              {member.user.email}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="size-10 rounded-md bg-muted flex items-center justify-center">
            <Phone className="size-5" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-muted-foreground">Phone</p>
            <Link
              href={`tel:${member.user.phone}`}
              className="text-base hover:underline text-[#1264a3]"
            >
              {member.user.phone ? member.user.phone : "Not provided"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
