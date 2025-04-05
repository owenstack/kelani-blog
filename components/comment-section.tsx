"use client";

import { sanityFetch } from "@/sanity/lib/fetch";
import { postCommentsQuery } from "@/sanity/lib/queries";
import { cn } from "@/lib/utils";
import { CommentForm } from "./comment-form";
import { Comment } from "./comment";
import { useSession } from "@/lib/auth.client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { PostCommentsQueryResult } from "@/sanity.types";
import { fetchComments } from "@/actions/blog";
import { description } from "@/sanity/lib/demo";
import { toast } from "sonner";

export function CommentSection({
	postId,
	className,
	slug,
	page = 1,
	commentsPerPage = 10,
}: {
	postId: string;
	slug: string;
	className?: string;
	page?: number;
	commentsPerPage?: number;
}) {
	const [comments, setComments] = useState<PostCommentsQueryResult>([]);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(page);
	const [hasMore, setHasMore] = useState(true);
	const { data } = useSession();

	const loadComments = async (reset = false) => {
		try {
			setLoading(true);
			const start = reset ? 0 : (currentPage - 1) * commentsPerPage;
			const end = start + commentsPerPage;
			const { data: newComments, error } = await fetchComments({
				postId,
				start,
				end,
			});
			if (error || !newComments) {
				toast.error("Failed to load comments", {
					description: error,
				});
				return;
			}
			if (reset) {
				setComments(newComments);
				setCurrentPage(2);
			} else {
				setComments((prev) => [...prev, ...newComments]);
				setCurrentPage((prev) => prev + 1);
			}

			setHasMore(newComments.length === commentsPerPage);
		} catch (error) {
			console.error("Error loading comments:", error);
		} finally {
			setLoading(false);
		}
	};
	// Initial load
	if (comments.length === 0 && !loading) {
		loadComments(true);
	}

	return (
		<section className={cn("grid gap-4", className)}>
			<h2 className="my-4 text-xl tracking-tight md:text-2xl">Comments</h2>
			<CommentForm
				slug={slug}
				postId={postId}
				onSuccess={(newComment) => {
					setComments(
						(prevComments) =>
							[newComment, ...prevComments] as PostCommentsQueryResult,
					);
				}}
			/>

			<div className="space-y-4">
				{comments.map((comment) => (
					<Comment
						key={comment._id}
						id={comment._id}
						comment={comment.comment}
						postId={postId}
						likes={comment.likes}
						dislikes={comment.dislikes}
						liked={comment.likedBy?.includes(data?.user?.id ?? "") ?? false}
						disliked={
							comment.dislikedBy?.includes(data?.user?.id ?? "") ?? false
						}
						slug={slug}
						replyCount={0}
					/>
				))}

				{hasMore && (
					<Button
						onClick={() => loadComments()}
						disabled={loading}
						className="w-full mt-4"
						variant="outline"
					>
						{loading ? "Loading..." : "Load More Comments"}
					</Button>
				)}

				{!hasMore && comments.length > 0 && (
					<p className="text-center text-sm text-muted-foreground mt-4">
						You've reached the end of the comments.
					</p>
				)}

				{comments.length === 0 && !loading && (
					<p className="text-center text-sm text-muted-foreground">
						Be the first to comment!
					</p>
				)}
			</div>
		</section>
	);
}
