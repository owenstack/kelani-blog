"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo-type";
import { buttonVariants } from "./ui/button";

export function NavBar() {
	const pathname = usePathname();
	return (
		<header className="sticky top-0 z-50 flex items-center justify-between px-4 py-2 bg-primary/10 backdrop-blur-sm">
			<Logo />
			<nav className="flex items-center gap-2">
				<Link
					href={"/posts"}
					className={cn(
						buttonVariants({ variant: "link" }),
						pathname.startsWith("/posts") ? "underline" : "",
						"text-primary-foreground",
					)}
				>
					Articles
				</Link>
				<Link
					href={"/about"}
					className={cn(
						buttonVariants({ variant: "link" }),
						pathname.startsWith("/about") ? "underline" : "",
						"text-primary-foreground",
					)}
				>
					About
				</Link>
				<Link
					href={"/contact"}
					className={cn(
						buttonVariants({ variant: "link" }),
						pathname.startsWith("/contact") ? "underline" : "",
						"text-primary-foreground",
					)}
				>
					Contact
				</Link>
			</nav>
		</header>
	);
}
