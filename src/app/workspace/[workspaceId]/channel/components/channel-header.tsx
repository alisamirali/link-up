import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDeleteChannel, useUpdateChannel } from "@/features/channels/api";
import { useCurrentMember } from "@/features/members/api";
import { useChannelId, useWorkspaceId } from "@/hooks";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "sonner";

type Props = {
  name: string;
};

export function ChannelHeader({ name }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(name);
  const [editOpen, setEditOpen] = useState(false);
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const { data: member } = useCurrentMember({
    workspaceId,
  });
  const { mutate: updateChannel, isPending: isUpdating } = useUpdateChannel();
  const { mutate: deleteChannel, isPending: isDeleting } = useDeleteChannel();

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== "admin") return;

    setEditOpen(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();

    setValue(value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateChannel(
      {
        id: channelId,
        name: value,
      },
      {
        onSuccess: () => {
          toast.success("Channel updated successfully");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update channel");
        },
      }
    );
  };

  const handleDeleteChannel = () => {
    deleteChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success("Channel deleted successfully");
          router.push(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error("Failed to delete channel");
        },
      }
    );
  };

  return (
    <header className="bg-white  border-b h-[50px] flex items-center px-4 overflow-hidden">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="text-lg font-semibold px-2 overflow-hidden w-auto"
          >
            <span className="truncate text-base"># {name}</span>
            <FaChevronDown className="size-2 ml-2 text-muted-foreground" />
          </Button>
        </DialogTrigger>

        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle># {name}</DialogTitle>
          </DialogHeader>

          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Channel name</p>
                    {member?.role === "admin" && (
                      <p className="text-sm text-[#1264A3] font-semibold hover:underline">
                        Edit
                      </p>
                    )}
                  </div>

                  <p className="text-sm"># {name}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this channel</DialogTitle>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <Input
                    value={value}
                    disabled={isUpdating}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={50}
                    placeholder="e.g. tech-private"
                  />

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isUpdating}>
                        Cancel
                      </Button>
                    </DialogClose>

                    <Button disabled={isUpdating}>Save changes</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {member?.role === "admin" && (
              <button
                className="flex items-center justify-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
                onClick={handleDeleteChannel}
              >
                <TrashIcon className="size-5 " />
                <p className="text-sm font-semibold">Delete channel</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
