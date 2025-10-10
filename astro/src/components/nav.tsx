import { Menu } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { buttonVariants } from "./ui/button";
import { Separator } from "./ui/separator";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./ui/sheet";

const navLinks: {
	title: string;
	href: `/${string}`;
}[] = [
	{
		title: "Home",
		href: "/",
	},
	{
		title: "Posts",
		href: "/posts",
	},
	{
		title: "About",
		href: "/about",
	},
];

const socialLinks: { title: string; href: string }[] = [
	{
		title: "Twitter",
		href: "https://twitter.com/@owenEEfobi",
	},
	{
		title: "GitHub",
		href: "https://github.com/owenstack",
	},
	{
		title: "LinkedIn",
		href: "https://linkedin.com/in/j1d30f0r",
	},
	{
		title: "Email",
		href: "mailto:owen@efobi.dev",
	},
];

export function NavSheet() {
	const { data } = useSession();
	return (
		<Sheet>
			<SheetTrigger className={buttonVariants({ variant: "ghost" })}>
				<Menu />
			</SheetTrigger>
			<SheetContent className="p-6">
				<SheetHeader>
					<SheetTitle className="sr-only">Navigation Links</SheetTitle>
				</SheetHeader>
				<div className="flex flex-col gap-2">
					{navLinks.map((link) => (
						<a
							key={link.href}
							href={link.href}
							className="-mx-2 rounded-md p-2 text-xl font-medium transition-colors hover:bg-muted/50"
						>
							{link.title}
						</a>
					))}
					<a
						href={data?.user ? "/dashboard" : "/login"}
						className="-mx-2 rounded-md p-2 text-xl font-medium transition-colors hover:bg-muted/50"
					>
						{data?.user ? "Dashboard" : "Log in"}
					</a>
				</div>
				<Separator className="my-8" />
				<div className="grid gap-8">
					<div className="space-y-2">
						<h3 className="font-[logo] text-lg font-semibold">Beyond Dogma</h3>
						<p className="text-sm text-muted-foreground">
							Exploring spirituality, comparing differences and similarities,
							and seeking truth without bias, for personal salvation and
							spiritual awakening.
						</p>
					</div>
					<div className="space-y-2">
						<h3 className="text-lg font-semibold">Connect</h3>
						<div className="flex flex-col items-start space-y-1">
							{socialLinks.map((link) => (
								<a
									className={buttonVariants({
										variant: "link",
										className: "h-auto p-0 text-muted-foreground",
									})}
									key={link.href}
									href={link.href}
								>
									{link.title}
								</a>
							))}
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
