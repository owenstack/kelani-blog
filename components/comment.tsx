"use client";

import {
	ThumbsDown,
	ThumbsUp,
	Reply,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { CommentForm } from "./comment-form";
import {
	likeComment,
	unlikeComment,
	dislikeComment,
	undislikeComment,
	fetchReplies,
} from "@/actions/blog";
import { toast } from "sonner";
import type { CommentProps } from "@/lib/constants";
import { useSession } from "@/lib/auth.client";

export function Comment({
	id,
	comment,
	postId,
	likes,
	dislikes,
	liked,
	disliked,
	slug,
	replyCount = 0,
	isReply = false,
	level = 0,
	parentId,
}: CommentProps) {
	const { data: userSession } = useSession();
	const [reply, showReply] = useState(false);
	const [isLiked, setIsLiked] = useState(liked);
	const [isDisliked, setIsDisliked] = useState(disliked);
	const [likeCount, setLikeCount] = useState(likes ?? 0);
	const [dislikeCount, setDislikeCount] = useState(dislikes ?? 0);
	const [replies, setReplies] = useState<CommentProps[]>([]);
	const [showReplies, setShowReplies] = useState(false);
	const [loadingReplies, setLoadingReplies] = useState(false);
	const [hasMoreReplies, setHasMoreReplies] = useState(replyCount > 0);
	const [page, setPage] = useState(1);
	const PAGE_SIZE = 5;

	const likeCommentHandler = async () => {
		try {
			const { error } = await likeComment({ commentId: id, slug });
			if (error) {
				toast.error("Something went wrong", {
					description: error,
				});
				return;
			}
			setIsLiked(true);
			setIsDisliked(false);
			setLikeCount((prev) => (prev ?? 0) + 1);
			if (isDisliked) setDislikeCount((prev) => (prev ?? 0) - 1);
			toast.success("Comment liked");
		} catch (error) {
			toast.error("Something went wrong", {
				description:
					error instanceof Error ? error.message : "Internal server error",
			});
		}
	};

	const dislikeCommentHandler = async () => {
		try {
			const { error } = await dislikeComment({ commentId: id, slug });
			if (error) {
				toast.error("Something went wrong", {
					description: error,
				});
				return;
			}
			setIsDisliked(true);
			setIsLiked(false);
			setDislikeCount((prev) => (prev ?? 0) + 1);
			if (isLiked) setLikeCount((prev) => (prev ?? 0) - 1);
			toast.success("Comment disliked");
		} catch (error) {
			toast.error("Something went wrong", {
				description:
					error instanceof Error ? error.message : "Internal server error",
			});
		}
	};

	const undislikeCommentHandler = async () => {
		try {
			const { error } = await undislikeComment({ commentId: id, slug });
			if (error) {
				toast.error("Something went wrong", {
					description: error,
				});
				return;
			}
			setIsDisliked(false);
			setDislikeCount((prev) => (prev ?? 0) - 1);
			toast.success("Removed your dislike");
		} catch (error) {
			toast.error("Something went wrong", {
				description:
					error instanceof Error ? error.message : "Internal server error",
			});
		}
	};

	const unlikeCommentHandler = async () => {
		try {
			const { error } = await unlikeComment({ commentId: id, slug });
			if (error) {
				toast.error("Something went wrong", {
					description: error,
				});
				return;
			}
			setIsLiked(false);
			setLikeCount((prev) => (prev ?? 0) - 1);
			toast.success("Removed your like");
		} catch (error) {
			toast.error("Something went wrong", {
				description:
					error instanceof Error ? error.message : "Internal server error",
			});
		}
	};

	const loadReplies = async (reset = false) => {
		try {
			setLoadingReplies(true);
			const currentPage = reset ? 1 : page;
			const { data, error } = await fetchReplies({
				commentId: id,
				page: currentPage,
				pageSize: PAGE_SIZE,
			});

			if (error) {
				toast.error("Failed to load replies");
				return;
			}
			const newReplies = data?.replies.map((r) => ({
				...r,
				liked: r.likedBy?.includes(userSession?.user?.email ?? "") ?? false,
				disliked:
					r.dislikedBy?.includes(userSession?.user?.email ?? "") ?? false,
				slug,
				id: r._id,
				postId,
			}));
			if (reset) {
				setReplies(newReplies ?? []);
			} else {
				setReplies((prev) => [...prev, ...(newReplies ?? [])]);
			}

			setHasMoreReplies(data?.hasMore ?? false);
			setPage(currentPage + 1);
		} catch (error) {
			toast.error("Something went wrong loading replies");
		} finally {
			setLoadingReplies(false);
		}
	};

	const toggleReplies = async () => {
		if (!showReplies && replies.length === 0) {
			await loadReplies(true);
		}
		setShowReplies((prev) => !prev);
	};

	const loadMoreReplies = async () => {
		await loadReplies();
	};

	const onReplyAdded = (newReply: CommentProps) => {
		setReplies((prev) => [newReply, ...prev]);
		setHasMoreReplies(true);
	};

	return (
		<div
			className={`flex flex-col gap-2 p-4 rounded-lg border ${isReply ? "ml-6" : ""}`}
		>
			<p className="text-sm">{comment}</p>
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-1">
					<Button
						onClick={isLiked ? unlikeCommentHandler : likeCommentHandler}
						size="sm"
						variant="ghost"
						className="h-8 w-8 p-0"
					>
						<ThumbsUp className={isLiked ? "fill-primary" : ""} size={16} />
					</Button>
					<span className="text-sm">{likeCount}</span>
				</div>
				<div className="flex items-center gap-1">
					<Button
						onClick={
							isDisliked ? undislikeCommentHandler : dislikeCommentHandler
						}
						size="sm"
						variant="ghost"
						className="h-8 w-8 p-0"
					>
						<ThumbsDown
							className={isDisliked ? "fill-primary" : ""}
							size={16}
						/>
					</Button>
					<span className="text-sm">{dislikeCount}</span>
				</div>
				<Button
					onClick={() => showReply((prev) => !prev)}
					size="sm"
					variant="ghost"
					className="h-8 w-8 p-0"
				>
					<Reply size={16} />
				</Button>

				{replyCount > 0 && !isReply && (
					<Button
						onClick={toggleReplies}
						size="sm"
						variant="ghost"
						className="text-xs flex items-center gap-1"
						disabled={loadingReplies}
					>
						{showReplies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
						{showReplies ? "Hide" : "View"} {replyCount}{" "}
						{replyCount === 1 ? "reply" : "replies"}
					</Button>
				)}
			</div>

			{reply && (
				<CommentForm
					slug={slug}
					postId={postId}
					commentId={id}
					onSuccess={onReplyAdded}
				/>
			)}

			{showReplies && (
				<div className="mt-2 border-l-2 pl-4">
					{loadingReplies && replies.length === 0 ? (
						<p className="text-sm text-muted-foreground">Loading replies...</p>
					) : (
						<>
							{replies.map((reply) => (
								<Comment
									key={reply.id}
									{...reply}
									isReply={true}
									level={level + 1}
									parentId={id}
									slug={slug}
								/>
							))}

							{hasMoreReplies && (
								<Button
									variant="ghost"
									size="sm"
									onClick={loadMoreReplies}
									disabled={loadingReplies}
									className="mt-2 text-xs"
								>
									{loadingReplies ? "Loading..." : "Load more replies"}
								</Button>
							)}
						</>
					)}
				</div>
			)}
		</div>
	);
}
