import { actions } from "astro:actions";
import { Reply, ReplyAll, ThumbsDown, ThumbsUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/hooks/use-store";
import type { Comment } from "@/lib/types";
import { Button } from "../ui/button";
import { CommentForm } from "./comment-form";

export interface Props {
	postId: string;
	initialComments: Comment[];
}

export function CommentList({ initialComments, postId }: Props) {
	const { set } = useStore.getState();
	const comments =
		useStore<Comment[]>((state) => state.cache[`comments-${postId}`]?.data) ??
		initialComments;

	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(initialComments.length === 10);

	const createFetcher = useCallback(
		(lastComment: Comment | undefined) => {
			const lastInteractionScore =
				lastComment?.interactionScore ?? Number.MAX_SAFE_INTEGER;
			const lastCommentId = lastComment?._id ?? "~";
			return async () => {
				const { data: newComments, error } =
					await actions.queries.fetchComments({
						postId,
						lastInteractionScore,
						lastCommentId,
					});
				if (error) {
					toast.error(error.code, { description: error.message });
					return []; // Return empty array on error
				}
				console.log("fetched comments: ", newComments);
				return newComments ?? [];
			};
		},
		[postId],
	);

	useEffect(() => {
		set(
			`comments-${postId}`,
			initialComments,
			createFetcher(initialComments[initialComments.length - 1]),
		);
	}, [postId, set, initialComments, createFetcher]);

	async function loadMoreComments() {
		if (isLoading || !hasMore) return;
		setIsLoading(true);

		try {
			const currentComments =
				useStore.getState().cache[`comments-${postId}`]?.data ?? [];
			const lastComment = currentComments[currentComments.length - 1];

			const fetcher = createFetcher(lastComment);
			const newComments = await fetcher();

			if (newComments && newComments.length > 0) {
				const updatedComments = [...currentComments, ...newComments];
				const newLastComment = updatedComments[updatedComments.length - 1];
				set(
					`comments-${postId}`,
					updatedComments,
					createFetcher(newLastComment),
				);
				setHasMore(newComments.length === 10);
			} else {
				setHasMore(false);
			}
		} catch (error) {
			console.error("Failed to load more comments:", error);
			toast.error("Failed to load comments");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="space-y-6">
			<div className="divide-y divide-border">
				{comments.length > 0 ? (
					<div>
						{comments.map((comment) => (
							<article key={comment._id} className="py-6 first:pt-0 last:pb-0">
								<div className="space-y-3">
									<div className="flex items-start justify-between gap-4">
										<p className="text-sm font-medium text-foreground">
											{comment.username}
										</p>
									</div>
									<p className="text-sm text-muted-foreground leading-relaxed">
										{comment.comment}
									</p>
									<div className="flex items-center gap-1">
										<Button
											variant="ghost"
											size="sm"
											className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
										>
											<ThumbsUp
												size={14}
												className={
													comment.likedBy ? "fill-current text-foreground" : ""
												}
											/>
											<span className="text-xs">{comment.likes}</span>
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
										>
											<ThumbsDown
												size={14}
												className={
													comment.dislikedBy
														? "fill-current text-foreground"
														: ""
												}
											/>
											<span className="text-xs">{comment.dislikes}</span>
										</Button>
										<div className="w-px h-4 bg-border mx-1" />
										<Button
											variant="ghost"
											size="sm"
											className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
										>
											<ReplyAll size={14} />
											<span className="text-xs">{comment.replies}</span>
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
										>
											<Reply size={14} />
											<span className="text-xs">Reply</span>
										</Button>
									</div>
								</div>
							</article>
						))}
						<CommentForm postId={postId} />
					</div>
				) : (
					<div className="py-12 text-center space-y-4">
						<p className="text-sm text-muted-foreground">
							No comments yet. Be the first to share your thoughts.
						</p>
						<CommentForm postId={postId} />
					</div>
				)}
			</div>
			{hasMore && comments.length > 0 && (
				<div className="pt-4 border-t border-border">
					<Button
						onClick={loadMoreComments}
						disabled={isLoading}
						variant="outline"
						className="w-full"
					>
						{isLoading ? "Loading..." : "Load More Comments"}
					</Button>
				</div>
			)}
		</div>
	);
}
