import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { runQuery } from "@/sanity/queries";
import { searchPostsQuery } from "@/sanity/queries/home";
import { createFetchPostsQuery } from "@/sanity/queries/posts";
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
};
