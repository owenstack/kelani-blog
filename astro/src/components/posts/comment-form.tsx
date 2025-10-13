import { actions } from "astro:actions";
import { Send } from "lucide-react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { useStore } from "../../hooks/use-store";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function CommentForm({
	postId,
	parentCommentId,
}: {
	postId: string;
	parentCommentId?: string;
}) {
	const { revalidate } = useStore.getState();
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const comment = formData.get("comment")?.toString().trim();
		if (!comment) {
			toast.error("Comment cannot be empty");
			return;
		}
		toast.promise(
			actions.mutations.createComment({ postId, comment, parentCommentId }),
			{
				loading: "Processing comment...",
				success: (res) => {
					if (res.error) {
						toast.error(res.error.code, { description: res.error.message });
						return "Processing complete";
					}
					revalidate(`comments-${postId}`);
					return res.data.message;
				},
				error: (err) => err.message || "Failed to post comment",
			},
		);
		e.currentTarget.reset();
	};

	return (
		<form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
			<Input
				name="comment"
				required
				placeholder={`Write a ${parentCommentId ? "reply" : "comment"}...`}
				className="flex-1"
			/>
			<Button size="icon" variant="ghost">
				<Send size={16} />
			</Button>
		</form>
	);
}
