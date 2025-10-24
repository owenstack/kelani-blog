import { z } from "groqd";
import { q } from ".";

export const postFromSlugQuery = q
	.parameters<{ slug: string }>()
	.star.filterByType("post")
	.filterRaw("slug.current == $slug")
	.slice(0)
	.project((sub) => ({
		_id: z.string(),
		title: z.string(),
		excerpt: z.string(),
		content: sub.field("content[]"),
		date: z.string(),
		slug: sub.field("slug.current", z.string()),
		tags: sub
			.field("tags[]")
			.deref()
			.project({
				_id: z.string(),
				title: z.string(),
				slug: ["slug.current", z.string()],
			}),
		coverImage: sub.field("coverImage.asset").deref().field("url").as<string>(),
	}));

export const relatedPostsQuery = q
	.parameters<{ tags: string[]; excludeId: string }>()
	.star.filterByType("post")
	.filterRaw("count((tags[]._ref)[@ in $tags]) > 0 && _id != $excludeId")
	//@ts-expect-error
	.order("count((tags[]._ref)[@ in $tags]) desc, date desc")
	.slice(0, 3)
	.project((sub) => ({
		title: z.string(),
		slug: sub.field("slug.current", z.string()),
		excerpt: z.string(),
		coverImage: sub.field("coverImage.asset").deref().field("url").as<string>(),
	}));

export const createFetchPostsQuery = (limit: number) =>
	q
		.parameters<{
			lastPostDate: string | null;
			lastPostId: string | null;
		}>()
		.star.filterByType("post")
		.filterRaw(
			"$lastPostDate == null || date < $lastPostDate || (date == $lastPostDate && _id < $lastPostId)",
		)
		.order("date desc", "_id desc")
		.slice(0, limit)
		.project((sub) => ({
			_id: z.string(),
			date: z.string(),
			title: z.string(),
			slug: sub.field("slug.current", z.string()),
			coverImage: sub
				.field("coverImage.asset")
				.deref()
				.field("url")
				.as<string>(),
			excerpt: z.string(),
			tags: sub
				.field("tags[]")
				.deref()
				.project({
					_id: z.string(),
					title: z.string(),
					slug: ["slug.current", z.string()],
				}),
		}));
