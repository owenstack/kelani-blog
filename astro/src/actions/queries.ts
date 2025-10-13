import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { auth } from "@/lib/auth";
import { runQuery } from "@/sanity/queries";
import { searchPostsQuery } from "@/sanity/queries/home";
import {
	createCommentsByPostIdQuery,
	createFetchPostsQuery,
} from "@/sanity/queries/posts";
import { allTagsQuery } from "@/sanity/queries/tags";

export const queries = {
	fetchPosts: defineAction({
		input: z.object({
			lastPostDate: z.string(),
			lastPostId: z.string(),
			limit: z.number().min(1).max(100).default(10),
		}),
		handler: async ({ lastPostDate, lastPostId, limit }) => {
			const posts = await runQuery(createFetchPostsQuery(limit), {
				parameters: { lastPostDate, lastPostId },
			});

			return posts;
		},
	}),
	fetchTags: defineAction({
		handler: async () => {
			const tags = await runQuery(allTagsQuery);
			return tags;
		},
	}),
	queryPosts: defineAction({
		input: z.object({
			query: z.string(),
		}),
		handler: async ({ query }) => {
			const posts = await runQuery(searchPostsQuery, { parameters: { query } });
			return posts;
		},
	}),
	fetchComments: defineAction({
		input: z.object({
			postId: z.string(),
			lastInteractionScore: z.number(),
			lastCommentId: z.string(),
			limit: z.number().min(1).max(100).default(10),
		}),
		handler: async (
			{ postId, lastInteractionScore, lastCommentId, limit },
			context,
		) => {
			const authz = await auth.api.getSession({
				headers: context.request.headers,
			});
			const email = authz?.user?.email || "";
			const comments = await runQuery(createCommentsByPostIdQuery(limit), {
				parameters: { postId, email, lastInteractionScore, lastCommentId },
			});
			return comments;
		},
	}),
};
