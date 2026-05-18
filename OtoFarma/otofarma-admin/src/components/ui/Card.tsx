import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface Props {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export default function Card({
  title,
  subtitle,
  actions,
  children,
  className,
  bodyClassName,
}: Props) {
  return (
    <section
      className={cn(
        "rounded-xl border border-clinical-border bg-white shadow-[0_1px_0_rgba(15,23,42,0.02)]",
        className,
      )}
    >
      {(title || actions) && (
        <header className="flex items-start justify-between gap-4 border-b border-clinical-border px-5 py-4">
          <div>
            {title && (
              <h3 className="text-sm font-semibold tracking-tight text-clinical-ink">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-xs text-clinical-muted">{subtitle}</p>
            )}
          </div>
          {actions}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}
