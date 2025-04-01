"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo-type";
import { buttonVariants } from "./ui/button";
import { Loader2, UserCircle2 } from "lucide-react";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuTrigger,
	NavigationMenuLink,
	NavigationMenuList,
} from "./ui/navigation-menu";
import { useSession } from "@/lib/auth.client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const navLinks = [
	{ href: "/posts", label: "Articles" },
	{ href: "/about", label: "About" },
	{ href: "/contact", label: "Contact" },
];

export function NavBar() {
	const { data, isPending } = useSession();
	const pathname = usePathname();

	return (
		<header className="sticky top-5 md:top-10 z-50 flex items-center justify-between w-full max-w-sm md:max-w-lg px-4 py-2 place-self-center backdrop-blur-sm border rounded-full shadow-md">
			<Logo />
			<NavigationMenu className="flex items-center w-full">
				<NavigationMenuList>
					<div className="flex items-center gap-2">
						<div className="hidden md:flex items-center gap-2">
							{navLinks.map((link) => (
								<NavigationMenuItem key={link.href}>
									<NavigationMenuLink asChild>
										<Link
											href={link.href}
											className={cn(
												buttonVariants({ variant: "link" }),
												pathname.startsWith(link.href)
													? "bg-secondary/20"
													: "hover:bg-secondary/10",
												"transition-colors",
											)}
										>
											{link.label}
										</Link>
									</NavigationMenuLink>
								</NavigationMenuItem>
							))}
						</div>
						<NavigationMenuItem className="md:hidden">
							<NavigationMenuTrigger
								className={cn(
									buttonVariants({ variant: "outline", size: "icon" }),
									"bg-transparent size-fit rounded-full hover:bg-secondary/10 focus:bg-secondary/10 transition-colors p-1",
								)}
							>
								<Avatar>
									<AvatarImage
										src={data?.user.image ?? data?.user.name?.charAt(0)}
										alt={data?.user.name ?? "User avatar"}
										className="bg-transparent"
										width={32}
										height={32}
									/>
									<AvatarFallback>
										{isPending ? (
											<Loader2 className="animate-spin" />
										) : (
											<UserCircle2 className="text-secondary" />
										)}
									</AvatarFallback>
								</Avatar>
							</NavigationMenuTrigger>
							<NavigationMenuContent className="backdrop-blur-sm border rounded-xl shadow-md">
								<nav className="flex flex-col gap-2 p-2">
									{navLinks.map((link) => (
										<Link
											key={link.href}
											href={link.href}
											className={cn(
												buttonVariants({ variant: "ghost", size: "sm" }),
												pathname.startsWith(link.href)
													? "bg-secondary/20"
													: "hover:bg-secondary/10",
												"w-full justify-start transition-colors",
											)}
										>
											{link.label}
										</Link>
									))}
									<Link
										href={data?.user ? "/dashboard" : "/log-in"}
										className={cn(
											buttonVariants({ variant: "ghost", size: "sm" }),
											pathname.startsWith(data?.user ? "/dashboard" : "/log-in")
												? "bg-secondary/20"
												: "hover:bg-secondary/10",
											"w-full justify-start transition-colors",
										)}
									>
										{data?.user ? "Dashboard" : "Log in"}
									</Link>
								</nav>
							</NavigationMenuContent>
						</NavigationMenuItem>
					</div>
				</NavigationMenuList>
			</NavigationMenu>
			<Link
				href={data?.user ? "/dashboard" : "/log-in"}
				className={cn(
					buttonVariants({ variant: "outline", size: "icon" }),
					"hidden md:flex bg-transparent size-fit rounded-full hover:bg-secondary/10 focus:bg-secondary/10 transition-colors p-1",
				)}
			>
				<Avatar>
					<AvatarImage
						src={data?.user.image ?? data?.user.name?.charAt(0)}
						alt={data?.user.name ?? "User avatar"}
						className="bg-transparent"
						width={32}
						height={32}
					/>
					<AvatarFallback>
						{isPending ? (
							<Loader2 className="animate-spin" />
						) : (
							<UserCircle2 className="text-secondary" />
						)}
					</AvatarFallback>
				</Avatar>
			</Link>
		</header>
	);
}
