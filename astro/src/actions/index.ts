import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { runQuery } from "@/sanity/queries";
import { createFetchPostsQuery } from "@/sanity/queries/posts";

export const server = {
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
};
