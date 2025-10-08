import { z } from "groqd";
import { q } from ".";

export const topInteractedPostsQuery = q.star
	.filterByType("post")
	.project((sub) => ({
		_id: z.string(),
		title: z.string(),
		slug: sub.field("slug.current", z.string()),
		excerpt: z.string(),
		coverImage: sub
			.field("coverImage.asset")
			.deref()
			.field("url", z.string().nullable()),
		commentCount: sub.raw(
			'count(*[_type == "comment" && post._ref == ^._id])',
			z.number(),
		),
	}))
	.order("commentCount desc")
	.slice(0, 2);

export const recentPostsQuery = q
	.parameters<{ exclude: string[] }>()
	.star.filterByType("post")
	.filterRaw("!(_id in $exclude)")
	.order("date desc")
	.slice(0, 6)
	.project((sub) => ({
		_id: z.string(),
		title: z.string(),
		slug: sub.field("slug.current", z.string()),
		excerpt: z.string(),
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
