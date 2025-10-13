import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { auth } from "@/lib/auth";
import { createComment } from "@/sanity/actions/comments";

export const mutations = {
	createComment: defineAction({
		input: z.object({
			postId: z.string(),
			comment: z.string().min(1).max(500),
			parentCommentId: z.string().optional(),
		}),
		handler: async ({ postId, comment, parentCommentId }, context) => {
			const authz = await auth.api.getSession({
				headers: context.request.headers,
			});
			if (!authz?.user) {
				return new ActionError({
					code: "UNAUTHORIZED",
					message: "You must be logged in to perform this action.",
				});
			}
			try {
				await createComment({
					username: authz.user.name,
					comment,
					email: authz.user.email,
					post: { _ref: postId, _type: "reference" },
					userId: authz.user.id,
					parentComment: parentCommentId
						? { _ref: parentCommentId, _type: "reference" }
						: undefined,
				});
				return { success: true, message: "Comment created successfully" };
			} catch (error) {
				return new ActionError({
					code: "INTERNAL_SERVER_ERROR",
					message:
						error instanceof Error
							? error.message
							: "An unknown error occurred",
				});
			}
		},
	}),
};
