"use client";

import { generateIntegrations } from "@/lib/constants";
import { useEffect, useState } from "react";

export const BouncingIcons = () => {
	const integrations = generateIntegrations().flat();
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % integrations.length);
		}, 200);

		return () => clearInterval(interval);
	}, [integrations.length]);

	return (
		<div className="absolute inset-0 overflow-hidden flex items-center justify-center">
			<div className="relative w-[35rem] h-[35rem]">
				{integrations.map((integration, index) => (
					<div
						key={integration.id}
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16"
						style={{
							opacity: index === currentIndex ? 1 : 0,
							transform: `translate(-50%, -50%) rotate(${(360 / integrations.length) * index}deg) translateY(-100px)`,
							transition: "all 0.3s ease-in-out",
						}}
					>
						{integration.icon}
					</div>
				))}
			</div>
		</div>
	);
};
