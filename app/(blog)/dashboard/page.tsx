import { ThemeToggle } from "@/components/theme-toggle";
import { WIP } from "@/components/wip";

export default function Page() {
	return (
		<main>
			<WIP />
			<ThemeToggle className="hidden" />
		</main>
	);
}
