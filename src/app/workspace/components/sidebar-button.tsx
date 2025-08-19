import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

type Props = {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
};

export function SidebarButton({ icon: Icon, label, isActive = false }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
      <Button
        variant="transparent"
        className={cn(
          "size-10 group-hover:bg-accent/20",
          isActive && "bg-accent/20"
        )}
      >
        <Icon className="size-6 text-white group-hover:scale-110 transition-all" />
      </Button>
      <span className="text-[12px] text-white group-hover:text-accent">
        {label}
      </span>
    </div>
  );
}
