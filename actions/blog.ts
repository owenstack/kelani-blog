"use server";

import { draftMode, headers } from "next/headers";
import { sanityCreate, sanityFetch, sanityMutate } from "@/sanity/lib/fetch";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
	likeCommentMutation,
	unlikeCommentMutation,
	dislikeCommentMutation,
	undislikeCommentMutation,
	commentRepliesQuery,
	postCommentsQuery,
} from "@/sanity/lib/queries";

export async function disableDraftMode() {
	"use server";
	await Promise.allSettled([
		(await draftMode()).disable(),
		// Simulate a delay to show the loading state
		new Promise((resolve) => setTimeout(resolve, 1000)),
	]);
}

export async function createComment({
	input,
	postId,
	commentId,
	slug,
}: { input: string; postId: string; commentId?: string; slug: string }) {
	try {
		const authz = await auth.api.getSession({ headers: await headers() });
		if (!authz?.user) {
			return { error: "Unauthorized" };
		}
		const createComment = await sanityCreate({
			_type: "comment",
			data: {
				userId: authz?.user?.id,
				username: authz.user.username ?? authz?.user?.name.split(" ")[0],
				email: authz?.user?.email,
				comment: input,
				post: {
					_ref: postId,
					_type: "reference",
				},
				...(commentId && {
					parentComment: {
						_ref: commentId,
						_type: "reference",
					},
				}),
				likes: 0,
				dislikes: 0,
				likedBy: [],
				dislikedBy: [],
				timestamp: new Date().toISOString(),
			},
		});
		if (!createComment) {
			return { error: "Failed to add your comment" };
		}
		revalidatePath(`/posts/${slug}`);
		return {
			success: true,
			message: "Comment added successfully",
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : "Internal server error",
		};
	}
}

export async function likeComment({
	commentId,
	slug,
}: {
	commentId: string;
	slug: string;
}) {
	try {
		const authz = await auth.api.getSession({ headers: await headers() });
		if (!authz?.user) {
			return { error: "Unauthorized" };
		}

		const mutations = [
			{
				patch: {
					id: commentId,
					set: {
						likes: likeCommentMutation,
						likedBy: `array::unique(array::union(coalesce(likedBy, []), ["${authz.user.email}"]))`,
					},
				},
			},
		];

		const result = await sanityMutate({ mutations });

		if (!result) {
			return { error: "Failed to like comment" };
		}

		revalidatePath(`/posts/${slug}`);
		return { success: true };
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : "Internal server error",
		};
	}
}

export async function unlikeComment({
	commentId,
	slug,
}: {
	commentId: string;
	slug: string;
}) {
	try {
		const authz = await auth.api.getSession({ headers: await headers() });
		if (!authz?.user) {
			return { error: "Unauthorized" };
		}

		const mutations = [
			{
				patch: {
					id: commentId,
					set: {
						likes: unlikeCommentMutation,
						likedBy: `array::filter(coalesce(likedBy, []), @item != "${authz.user.email}")`,
					},
				},
			},
		];
		const result = await sanityMutate({ mutations });

		if (!result) {
			return { error: "Failed to unlike comment" };
		}

		revalidatePath(`/posts/${slug}`);
		return { success: true };
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : "Internal server error",
		};
	}
}

export async function dislikeComment({
	commentId,
	slug,
}: {
	commentId: string;
	slug: string;
}) {
	try {
		const authz = await auth.api.getSession({ headers: await headers() });
		if (!authz?.user) {
			return { error: "Unauthorized" };
		}

		const mutations = [
			{
				patch: {
					id: commentId,
					set: {
						dislikes: dislikeCommentMutation,
						dislikedBy: `array::unique(array::union(coalesce(dislikedBy, []), ["${authz.user.email}"]))`,
					},
				},
			},
		];
		const result = await sanityMutate({ mutations });

		if (!result) {
			return { error: "Failed to dislike comment" };
		}

		revalidatePath(`/posts/${slug}`);
		return { success: true };
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : "Internal server error",
		};
	}
}

export async function undislikeComment({
	commentId,
	slug,
}: {
	commentId: string;
	slug: string;
}) {
	try {
		const authz = await auth.api.getSession({ headers: await headers() });
		if (!authz?.user) {
			return { error: "Unauthorized" };
		}

		const mutations = [
			{
				patch: {
					id: commentId,
					set: {
						dislikes: undislikeCommentMutation,
						dislikedBy: `array::filter(coalesce(dislikedBy, []), @item != "${authz.user.email}")`,
					},
				},
			},
		];
		const result = await sanityMutate({ mutations });

		if (!result) {
			return { error: "Failed to undislike comment" };
		}

		revalidatePath(`/posts/${slug}`);
		return { success: true };
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : "Internal server error",
		};
	}
}

export async function fetchReplies({
	commentId,
	page = 1,
	pageSize = 5,
}: {
	commentId: string;
	page?: number;
	pageSize?: number;
}) {
	try {
		const start = (page - 1) * pageSize;
		const end = start + pageSize;

		const replies = await sanityFetch({
			query: commentRepliesQuery,
			params: { commentId, start, end },
		});

		return {
			data: {
				replies,
				hasMore: replies.length === pageSize,
			},
		};
	} catch (error) {
		console.error("Error fetching replies:", error);
		return {
			error: "Failed to fetch replies",
		};
	}
}

export async function fetchComments({
	postId,
	start,
	end,
}: { postId: string; start: number; end: number }) {
	try {
		const comments = await sanityFetch({
			query: postCommentsQuery,
			params: { postId, start, end },
		});
		if (!comments) {
			return { error: "Failed to fetch comments" };
		}
		return { success: true, data: comments };
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : "Internal server error",
		};
	}
}
