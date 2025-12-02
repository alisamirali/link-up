import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import Link from "next/link";

type Props = {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
  href?: string;
};

export function SidebarButton({
  icon: Icon,
  label,
  isActive = false,
  href,
}: Props) {
  const buttonContent = (
    <>
      <Icon className="size-6 text-white group-hover:scale-110 transition-all" />
    </>
  );

  const wrapperContent = (
    <div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
      {href ? (
        <Button
          variant="transparent"
          className={cn(
            "size-10 group-hover:bg-accent/20",
            isActive && "bg-accent/20"
          )}
          asChild
        >
          <Link href={href}>{buttonContent}</Link>
        </Button>
      ) : (
        <Button
          variant="transparent"
          className={cn(
            "size-10 group-hover:bg-accent/20",
            isActive && "bg-accent/20"
          )}
        >
          {buttonContent}
        </Button>
      )}
      <span className="text-[12px] text-white group-hover:text-accent">
        {label}
      </span>
    </div>
  );

  return wrapperContent;
}
