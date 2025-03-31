import {
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
} from "lucide-react";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface Integration {
	id: string;
	icon: JSX.Element;
}

export const generateIntegrations = () => {
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

export const cfContext = await getCloudflareContext({ async: true });
