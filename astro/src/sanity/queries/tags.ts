import { z } from "groqd";
import { q } from ".";

export const tagFromSlugQuery = q
	.parameters<{ slug: string }>()
	.star.filterByType("tag")
	.filterRaw("slug.current == $slug")
	.slice(0)
	.project({
		_id: z.string(),
		title: z.string(),
		description: z.string().nullable(),
	});

export const postsFromTagQuery = q
	.parameters<{ _id: string }>()
	.star.filterByType("post")
	.filterRaw("_id in tags[]._ref == $_id")
	.order("date desc")
	.project((sub) => ({
		_id: z.string(),
		title: z.string(),
		slug: sub.field("slug.current", z.string()),
		tags: sub
			.field("tags[]")
			.deref()
			.project({
				_id: z.string(),
				title: z.string(),
				slug: ["slug.current", z.string()],
			}),
		coverImage: sub
			.field("coverImage.asset")
			.deref()
			.field("url", z.string().nullable()),
	}));
