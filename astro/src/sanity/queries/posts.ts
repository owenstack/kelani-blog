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

export const createCommentsByPostIdQuery = (limit: number) =>
	q
		.parameters<{
			postId: string;
			email: string | null;
			lastInteractionScore: number;
			lastCommentId: string;
		}>()
		.star.filterByType("comment")
		.filterRaw("post._ref == $postId && !defined(parentComment)")
		.filterRaw(
			"(coalesce(likes, 0) - coalesce(dislikes, 0)) < $lastInteractionScore || ((coalesce(likes, 0) - coalesce(dislikes, 0)) == $lastInteractionScore && _id < $lastCommentId)",
		)
		//@ts-expect-error
		.order("(coalesce(likes, 0) - coalesce(dislikes, 0)) desc, _id desc")
		.slice(0, limit)
		.project((sub) => ({
			_id: z.string(),
			username: z.string(),
			comment: z.string(),
			likes: z.number().nullable().default(0),
			dislikes: z.number().nullable().default(0),
			interactionScore: sub
				.raw("coalesce(likes, 0) - coalesce(dislikes, 0)")
				.as<number>(),
			replies: sub
				.raw('count(*[_type == "comment" && parentComment._ref == ^._id])')
				.as<number>(),
			likedBy: sub.raw("coalesce($email in likedBy, false)").as<boolean>(),
			dislikedBy: sub
				.raw("coalesce($email in dislikedBy, false)")
				.as<boolean>(),
		}));
