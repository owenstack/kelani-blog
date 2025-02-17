import * as React from "react";
import type { SVGProps } from "react";

const Grid = (props: SVGProps<SVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 1400 600"
		className="min-h-full min-w-full"
		aria-hidden="true"
	>
		<title>Grid Background</title>
		<defs>
			<pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
				<path
					d="M 24 0 L 0 0 0 24"
					fill="none"
					stroke="hsl(var(--muted))"
					strokeWidth="1"
					strokeOpacity={0.5}
				/>
			</pattern>
		</defs>
		<rect width="1400" height="600" fill="url(#grid)" />
	</svg>
);

export { Grid };
