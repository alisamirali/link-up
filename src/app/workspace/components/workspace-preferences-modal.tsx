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
import {
  useDeleteWorkspace,
  useUpdateWorkspace,
} from "@/features/workspaces/api";
import { useWorkspaceId } from "@/hooks";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type WorkspacePreferencesModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialEmoji: string;
  initialName: string;
};

export function WorkspacePreferencesModal({
  open,
  setOpen,
  initialEmoji,
  initialName,
}: WorkspacePreferencesModalProps) {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const [emoji, setEmoji] = useState(initialEmoji);
  const [name, setName] = useState(initialName);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { mutate: updateWorkspace, isPending: isUpdating } =
    useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeleting } =
    useDeleteWorkspace();

  function handleEditWorkspace(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    updateWorkspace(
      {
        id: workspaceId,
        emoji,
        name,
      },
      {
        onSuccess: () => {
          toast.success("Workspace updated successfully");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update workspace");
        },
      }
    );
  }

  function handleDeleteWorkspace() {
    deleteWorkspace(
      {
        id: workspaceId,
      },
      {
        onSuccess: () => {
          toast.success("Workspace deleted successfully");
          setEditOpen(false);
          router.replace("/");
        },
        onError: () => {
          toast.error("Failed to delete workspace");
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 bg-gray-50 overflow-hidden">
        <DialogHeader className="p-4 border-b bg-white">
          <DialogTitle>{name}</DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-4 flex flex-col gap-y-2">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">Workspace Name</p>
                  <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                    Edit
                  </p>
                </div>

                <p className="text-sm">{name}</p>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename this workspace</DialogTitle>
              </DialogHeader>

              <form className="space-y-4" onSubmit={handleEditWorkspace}>
                <Input
                  name="emoji"
                  value={emoji}
                  disabled={isUpdating}
                  onChange={(e) => setEmoji(e.target.value)}
                  autoFocus
                  minLength={1}
                  placeholder="Workspace emoji e.g. '🚀', '💼'"
                />
                <Input
                  name="name"
                  value={name}
                  disabled={isUpdating}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={3}
                  maxLength={50}
                  placeholder="Workspace name e.g. 'Work', 'Personal'"
                />

                <DialogFooter>
                  <DialogClose>
                    <Button variant="outline" disabled={isUpdating}>
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button type="submit" disabled={isUpdating}>
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <button
                disabled={isDeleting}
                className="flex items-center justify-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600 outline-none"
              >
                <TrashIcon className="size-5" />
                <p className="text-sm font-semibold">Delete Workspace</p>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Are you sure you want to delete this workspace?
                </DialogTitle>
              </DialogHeader>

              <DialogFooter>
                <DialogClose>
                  <Button variant="outline" disabled={isDeleting}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button disabled={isDeleting} onClick={handleDeleteWorkspace}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}
