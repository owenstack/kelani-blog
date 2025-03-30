import { BlogSection } from "@/components/home/blog-section";
import { MainHero } from "@/components/home/main-hero";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";

export default async function Page() {
	const settings = await sanityFetch({ query: settingsQuery });

	return (
		<div>
			<MainHero heading={settings?.title} description={settings?.description} />
			<BlogSection limit={6} />
		</div>
	);
}
