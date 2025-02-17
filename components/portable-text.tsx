/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import { cn } from "@/lib/utils";
import {
	PortableText,
	type PortableTextBlock,
	type PortableTextComponents,
} from "next-sanity";

export function CustomPortableText({
	className,
	value,
}: {
	className?: string;
	value: PortableTextBlock[];
}) {
	const components: PortableTextComponents = {
		block: {
			h5: ({ children }) => (
				<h5 className="mb-2 text-sm font-semibold">{children}</h5>
			),
			h6: ({ children }) => (
				<h6 className="mb-1 text-xs font-semibold">{children}</h6>
			),
		},
		marks: {
			link: ({ children, value }) => {
				return (
					<a href={value?.href} rel="noreferrer noopener">
						{children}
					</a>
				);
			},
		},
	};

	return (
		<div className={cn("prose", className)}>
			<PortableText components={components} value={value} />
		</div>
	);
}
