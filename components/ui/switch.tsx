"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight switch — no external primitive, fully accessible via a
 * native checkbox. Avoids adding a new Radix dependency.
 */
function Switch({
  className,
  defaultChecked,
  checked,
  onCheckedChange,
  disabled,
  id,
}: {
  className?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
}) {
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const isControlled = checked !== undefined;
  const value = isControlled ? checked : internal;

  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={value}
      disabled={disabled}
      onClick={() => {
        const nextVal = !value;
        if (!isControlled) setInternal(nextVal);
        onCheckedChange?.(nextVal);
      }}
      className={cn(
        "focus-visible:ring-ring/50 peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        value ? "bg-primary" : "bg-input",
        className
      )}
    >
      <span
        className={cn(
          "bg-background pointer-events-none block size-4 rounded-full shadow-sm ring-0 transition-transform",
          value ? "translate-x-[18px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export { Switch };
