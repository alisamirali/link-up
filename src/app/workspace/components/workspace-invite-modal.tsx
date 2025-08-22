import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNewJoinCode } from "@/features/workspaces/api";
import { useWorkspaceId } from "@/hooks";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  emoji: string;
  joinCode: string;
};

export function WorkspaceInviteModal({
  open,
  setOpen,
  name,
  emoji,
  joinCode,
}: Props) {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useNewJoinCode();

  const handleCopyLink = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard"));
  };

  const handleNewCode = () => {
    mutate(
      { workspaceId },
      {
        onSuccess: () => toast.success("New code generated"),
        onError: () => toast.error("Failed to generate new code"),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite people to your workspace</DialogTitle>
          <DialogDescription>
            Use the code below to invite people to your workspace
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-y-4 items-center justify-center py-10">
          <p className="text-4xl font-bold tracking-widest">{joinCode}</p>
          <Button variant="ghost" size="sm" onClick={handleCopyLink}>
            Copy link
            <CopyIcon className="size-5 ml-2" />
          </Button>
        </div>

        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            onClick={handleNewCode}
            disabled={isPending}
          >
            Generate new code
            <RefreshCcw className="size-5 ml-2" />
          </Button>

          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
