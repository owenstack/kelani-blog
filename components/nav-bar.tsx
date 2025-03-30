"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo-type";
import { buttonVariants } from "./ui/button";

export function NavBar() {
	const pathname = usePathname();
	return (
		<header className="sticky top-10 z-50 flex items-center justify-between w-full md:max-w-lg px-4 py-2 place-self-center backdrop-blur-sm border rounded-full shadow-md">
			<Logo />
			<nav className="flex items-center gap-2">
				<Link
					href={"/posts"}
					className={cn(
						buttonVariants({ variant: "link" }),
						pathname.startsWith("/posts") ? "underline" : "",
						"text-secondary",
					)}
				>
					Articles
				</Link>
				<Link
					href={"/about"}
					className={cn(
						buttonVariants({ variant: "link" }),
						pathname.startsWith("/about") ? "underline" : "",
						"text-secondary",
					)}
				>
					About
				</Link>
				<Link
					href={"/contact"}
					className={cn(
						buttonVariants({ variant: "link" }),
						pathname.startsWith("/contact") ? "underline" : "",
						"text-secondary",
					)}
				>
					Contact
				</Link>
			</nav>
		</header>
	);
}
