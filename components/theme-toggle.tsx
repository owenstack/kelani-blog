"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

export function ThemeToggle({ className }: { className?: string }) {
	const { setTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<div className={cn("space-y-1", className)}>
			<h2>Theme</h2>
			<p className="text-sm text-muted-foreground">Select the device theme</p>
			<RadioGroup
				onValueChange={setTheme}
				defaultValue={theme || "light"}
				className="grid max-w-md grid-cols-2 gap-8 pt-2"
			>
				<div>
					<Label className="[&:has([data-state=checked])>div]:border-primary">
						<RadioGroupItem value="light" className="sr-only" />
						<div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
							<div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
								<div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
									<div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
									<div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
								</div>
								<div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
									<div className="h-4 w-4 rounded-full bg-[#ecedef]" />
									<div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
								</div>
								<div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
									<div className="h-4 w-4 rounded-full bg-[#ecedef]" />
									<div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
								</div>
							</div>
						</div>
						<span className="block w-full p-2 text-center font-normal">
							Light
						</span>
					</Label>
				</div>
				<div>
					<Label className="[&:has([data-state=checked])>div]:border-primary">
						<RadioGroupItem value="dark" className="sr-only" />
						<div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
							<div className="space-y-2 rounded-sm bg-slate-950 p-2">
								<div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
									<div className="h-2 w-[80px] rounded-lg bg-slate-400" />
									<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
								</div>
								<div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
									<div className="h-4 w-4 rounded-full bg-slate-400" />
									<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
								</div>
								<div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
									<div className="h-4 w-4 rounded-full bg-slate-400" />
									<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
								</div>
							</div>
						</div>
						<span className="block w-full p-2 text-center font-normal">
							Dark
						</span>
					</Label>
				</div>
			</RadioGroup>
		</div>
	);
}
