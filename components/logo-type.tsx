import { cn } from "@/lib/utils";
import local from "next/font/local";
import Link from "next/link";

const logotype = local({
	src: "../assets/fonts/logotype.ttf",
});

export function Logo({ className }: { className?: string }) {
	return (
		<Link href={"/"}>
			<h1
				className={cn(
					className,
					"font-bold text-secondary-foreground",
					logotype.className,
				)}
			>
				Beyond Dogma
			</h1>
		</Link>
	);
}
