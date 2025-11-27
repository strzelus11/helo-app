"use client";

import { Button } from "@app/components/ui/button";
import { cn } from "@app/lib/utils";
import { type ButtonHTMLAttributes } from "react";

type FloatingIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
};

export function FloatingIconButton({
  icon,
  className,
  ...props
}: FloatingIconButtonProps) {
  return (
    <Button
      size="icon"
      variant="outline"
      className={cn(
        "rounded-full shadow-lg border-border bg-popover backdrop-blur-sm",
        "hover:bg-popover-foreground",
        className,
      )}
      {...props}
    >
      {icon}
    </Button>
  );
}
