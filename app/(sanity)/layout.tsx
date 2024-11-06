import { Inter } from "next/font/google";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

export { metadata, viewport } from "next-sanity/studio";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <main className={`min-h-screen ${inter.variable}`}>{children}</main>;
}
