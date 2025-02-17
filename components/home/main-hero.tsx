import { Grid } from "@/assets/icons/grid";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	Cloud,
	Fan,
	Flower,
	Flower2,
	Heart,
	Leaf,
	Moon,
	Palette,
	Shapes,
	Snowflake,
	Sparkles,
	Star,
	Sun,
	Waves,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { CustomPortableText } from "../portable-text";

interface Integration {
	id: string;
	icon: JSX.Element;
}

interface Hero32Props {
	heading?: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	description?: any;
	integrations?: Integration[][];
}

const generateIntegrations = () => {
	const icons = [
		Flower,
		Flower2,
		Fan,
		Leaf,
		Cloud,
		Sun,
		Moon,
		Star,
		Heart,
		Zap,
		Sparkles,
		Palette,
		Shapes,
		Snowflake,
		Waves,
	];

	const rows = 3;
	const iconsPerRow = 5;
	const integrations: Integration[][] = [];

	for (let i = 0; i < rows; i++) {
		const row: Integration[] = [];
		for (let j = 0; j < iconsPerRow; j++) {
			const IconComponent = icons[i * iconsPerRow + j];
			row.push({
				id: `integration-${i * iconsPerRow + j + 1}`,
				icon: <IconComponent className="w-full h-full text-primary" />,
			});
		}
		integrations.push(row);
	}

	return integrations;
};

const MainHero = ({
	heading = "Beyond Dogma",
	description = "Welcome to a space where beauty meets mindfulness. Explore curated content on wellness, fashion, and personal growth designed to help you shine from within.",
	integrations = generateIntegrations(),
}: Hero32Props) => {
	return (
		<section className="relative overflow-hidden gradient min-h-screen">
			<div className="absolute inset-0 overflow-hidden">
				<Grid />
			</div>
			<div className="relative">
				<div className="absolute left-0 z-10 hidden h-full w-1/2 md:block" />
				<div className="container relative flex flex-col items-start md:flex-row md:items-center md:space-x-8 lg:space-x-16">
					<div className="z-20 w-full shrink-0 bg-background/80 px-4 py-16 md:w-1/2 md:bg-transparent md:py-32">
						<div className="flex flex-col items-center md:items-start md:text-left">
							<div className="max-w-md mx-auto md:mx-0">
								<h1 className="my-6 text-pretty text-3xl font-semibold sm:text-4xl lg:text-6xl">
									{heading}
								</h1>
								<CustomPortableText
									className="text-muted-foreground sm:text-base text-xl"
									value={description?.length ? description : ""}
								/>
								<Link
									href={"/posts"}
									className={cn(
										buttonVariants({ size: "lg" }),
										"mt-8 w-full sm:w-auto",
									)}
								>
									Start your journey
								</Link>
							</div>
						</div>
					</div>
					<div>
						<div className="flex flex-col gap-8 sm:gap-12 md:gap-16 py-8 md:py-32">
							{integrations.map((line, i) => (
								<div
									key={`row-${
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										i
									}`}
									className="flex gap-4 sm:gap-8 md:gap-12 lg:gap-24 odd:-translate-x-12 md:odd:-translate-x-24"
								>
									{line.map((integration) => (
										<div
											key={integration.id}
											className="size-24 rounded-xl border border-background bg-background/80 backdrop-blur-sm shadow-xl transition-transform hover:scale-105"
										>
											<div className="h-full w-full bg-muted/20 p-4">
												{integration.icon}
											</div>
										</div>
									))}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
export { MainHero };
