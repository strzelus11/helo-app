"use client";

import { cn } from "@app/lib/utils";
import { LucideIcon, LucideProps } from "lucide-react";

type BaseLucideProps = Omit<LucideProps, "size" | "strokeWidth" | "ref">;

export type IconProps = {
	icon: LucideIcon; // the Lucide component, e.g. Search
	size?: number; // pixel size, e.g. 18, 20, 24...
	strokeWidth?: number; // numeric thickness, overrides Lucide default 2
	className?: string;
} & BaseLucideProps

export function Icon({
	icon: IconComponent,
	size = 20,
	strokeWidth = 1.75,
	className,
	...props
}: IconProps) {
	return (
		<IconComponent
			{...props}
			className={cn("text-foreground", className)}
			width={size}
			height={size}
			strokeWidth={strokeWidth}
		/>
	);
}
