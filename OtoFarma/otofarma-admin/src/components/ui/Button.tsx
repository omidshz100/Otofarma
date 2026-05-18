import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface Props {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const VARIANTS: Record<NonNullable<Props["variant"]>, string> = {
  primary:
    "bg-clinical-ink text-white hover:bg-clinical-ink/90 border border-clinical-ink",
  secondary:
    "bg-white text-clinical-ink border border-clinical-border hover:bg-clinical-bg",
  ghost:
    "bg-transparent text-clinical-muted hover:text-clinical-ink hover:bg-clinical-bg border border-transparent",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 border border-rose-600",
};

export default function Button({
  variant = "secondary",
  icon,
  children,
  onClick,
  className,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition",
        VARIANTS[variant],
        className,
      )}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
