"use client";

import LinkedIn from "@/assets/icons/linkedin";
import { ArrowUp, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardFooter, CardHeader } from "../ui/card";

export function ShareCard({ title }: { title: string }) {
	const handleScrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const handleShare = (
		platform: "facebook" | "twitter" | "linkedin" | "instagram",
	) => {
		const url = window.location.href;

		const shareUrls = {
			facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
			twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
			linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
			instagram: `https://www.instagram.com/share?url=${encodeURIComponent(url)}`,
		};

		window.open(shareUrls[platform], "_blank", "width=600,height=400");
	};
	return (
		<div className="sticky top-16 col-span-4 hidden h-fit lg:block">
			<Card>
				<CardHeader className="flex items-center justify-between">
					<p className="font-medium">Share</p>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="icon"
							className="rounded-full"
							onClick={() => handleShare("facebook")}
						>
							<Facebook className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="rounded-full"
							onClick={() => handleShare("twitter")}
						>
							<Twitter className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="rounded-full"
							onClick={() => handleShare("linkedin")}
						>
							<LinkedIn className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="rounded-full"
							onClick={() => handleShare("instagram")}
						>
							<Instagram className="h-4 w-4" />
						</Button>
					</div>
				</CardHeader>
				<CardFooter>
					<Button
						variant={"outline"}
						onClick={handleScrollToTop}
						className="w-full"
					>
						<ArrowUp className="mr-2 h-4 w-4" />
						Back to top
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
