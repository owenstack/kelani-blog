import localFont from "next/font/local";

const body = localFont({
	src: "../../assets/fonts/body.ttf",
});

export { metadata, viewport } from "next-sanity/studio";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <main className={`min-h-screen ${body.className}`}>{children}</main>;
}
