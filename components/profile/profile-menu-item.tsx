import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProfileMenuItemProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  colorClass: string;
  bgClass: string;
  rightElement?: ReactNode;
  subLabel?: ReactNode;
}

export const ProfileMenuItem = ({
  icon,
  label,
  onClick,
  colorClass,
  bgClass,
  rightElement,
  subLabel,
}: ProfileMenuItemProps) => {
  return (
    <div
      onClick={onClick}
      className="p-4 flex items-center justify-between active:bg-white/5 transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "size-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform",
            bgClass,
            colorClass,
          )}
        >
          {icon}
        </div>
        <div>
          <span className="font-bold text-sm text-white">{label}</span>
          {subLabel}
        </div>
      </div>
      {rightElement || <ChevronRight className="w-5 h-5 text-slate-600" />}
    </div>
  );
};
