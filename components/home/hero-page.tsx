import { MainHero } from "@/components/home/main-hero";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { NavBar } from "../nav-bar";
import { BlogSection } from "./blog-section";

export async function HeroPage() {
	const settings = await sanityFetch({ query: settingsQuery });

	return (
		<>
			<NavBar />
			<MainHero heading={settings?.title} description={settings?.description} />
			<BlogSection limit={6} />
		</>
	);
}
