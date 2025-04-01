import { AlertBanner } from "@/components/alert-banner";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { VisualEditing, toPlainText } from "next-sanity";
import localFont from "next/font/local";
import { draftMode } from "next/headers";

import { NavBar } from "@/components/nav-bar";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
	const settings = await sanityFetch({
		query: settingsQuery,
		// Metadata should never contain stega
		stega: false,
	});
	const title = settings?.title || demo.title;
	const description = settings?.description || demo.description;

	const ogImage = resolveOpenGraphImage(settings?.ogImage);
	let metadataBase: URL | undefined = undefined;
	try {
		metadataBase = settings?.ogImage?.metadataBase
			? new URL(settings.ogImage.metadataBase)
			: undefined;
	} catch {
		// ignore
	}
	return {
		metadataBase,
		title: {
			template: `%s | ${title}`,
			default: title,
		},
		description: toPlainText(description),
		openGraph: {
			images: ogImage ? [ogImage] : [],
		},
	};
}

const body = localFont({
	src: "../../assets/fonts/body.ttf",
	variable: "--body",
});

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isEnabled: isDraftMode } = await draftMode();

	return (
		<main className={`${body.variable}`}>
			<NavBar />
			{isDraftMode && <AlertBanner />}
			{children}
			{isDraftMode && <VisualEditing />}
			<SpeedInsights />
			<Toaster />
		</main>
	);
}
