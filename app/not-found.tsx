import { BouncingIcons } from "@/components/bounce";
import { NavBar } from "@/components/nav-bar";

export default function Page() {
	return (
		<main className="flex min-h-screen flex-col bg-gradient-to-b from-black to-gray-900 text-white">
			<NavBar />
			<div className="flex flex-1 flex-col items-center justify-center relative px-4">
				<div className="z-10 text-center p-8 backdrop-blur-sm bg-black/30 rounded-xl border border-gray-800 shadow-xl">
					<h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
						404
					</h1>
					<p className="text-2xl text-gray-300 mb-8">Page not found</p>
				</div>
				<BouncingIcons />
			</div>
		</main>
	);
}
