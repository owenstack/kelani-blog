"use client";

import Form from "next/form";
import { Submit } from "./submit";
import { toast } from "sonner";
import { useSession } from "@/lib/auth.client";
import { Input } from "./ui/input";
import { check } from "leo-profanity";
import { createComment } from "@/actions/blog";
import { Send } from "lucide-react";
import type { CommentProps } from "@/lib/constants";

export function CommentForm({
	postId,
	commentId,
	slug,
	onSuccess,
}: {
	postId: string;
	commentId?: string;
	slug: string;
	onSuccess?: (newComment: CommentProps) => void;
}) {
	const { data } = useSession();

	const handleSubmit = async (form: FormData) => {
		if (!data?.user) {
			toast.error("Please login to comment");
			return;
		}
		const input = form.get("comment") as string;
		if (check(input)) {
			toast.error("Please avoid using profanity");
			return;
		}
		try {
			const { error, message } = await createComment({
				input,
				postId,
				commentId,
				slug,
			});
			if (error) {
				toast.error("Something went wrong", {
					description: error,
				});
				return;
			}
			toast.success(message);
		} catch (error) {
			toast.error("Something went wrong", {
				description:
					error instanceof Error ? error.message : "Internal server error",
			});
		} finally {
			form.set("comment", "");
		}
	};

	return (
		<Form
			action={handleSubmit}
			className="grid grid-cols-7 gap-2 w-full max-w-2xl"
		>
			<Input
				className="col-span-6"
				id="comment"
				name="comment"
				placeholder={commentId ? "Write your reply..." : "Write a comment..."}
			/>
			<Submit size={"icon"}>
				<Send />
			</Submit>
		</Form>
	);
}
