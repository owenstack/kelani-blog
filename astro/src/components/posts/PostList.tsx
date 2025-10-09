import { actions } from "astro:actions";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Post = {
	_id: string;
	title: string;
	excerpt: string;
	date: string;
	slug: string;
	coverImage: string | null;
	tags: {
		_id: string;
		title: string;
		slug: string;
	}[];
};

export interface Props {
	initialPosts: Post[];
}

export default function PostList({ initialPosts }: Props) {
	const [posts, setPosts] = useState<Post[]>(initialPosts);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(initialPosts.length === 10);

	async function loadMorePosts() {
		if (isLoading || !hasMore) return;
		setIsLoading(true);

		const lastPost = posts[posts.length - 1];
		const lastPostDate = lastPost.date;
		const lastPostId = lastPost._id;

		try {
			const { data: newPosts, error } = await actions.fetchPosts({
				lastPostDate,
				lastPostId,
			});
			if (error) {
				toast.error(error.message);
				return;
			}
			if (newPosts.length > 0) {
				setPosts((prevPosts) => [...prevPosts, ...newPosts]);
				if (newPosts.length < 10) {
					setHasMore(false);
				}
			} else {
				setHasMore(false);
			}
		} catch (error) {
			console.error("Failed to load more posts:", error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div>
			<div className="grid grid-cols-1 gap-8">
				{posts.map((post) => (
					<div
						key={post._id}
						className="flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-md"
					>
						<a href={`/posts/${post.slug}`} className="block">
							{post.coverImage && (
								<img
									src={post.coverImage}
									alt={post.title}
									className="h-48 w-full object-cover"
								/>
							)}
						</a>
						<div className="flex flex-1 flex-col p-4">
							<a href={`/posts/${post.slug}`} className="block">
								<h3 className="mb-2 text-xl font-semibold leading-tight tracking-tight text-primary">
									{post.title}
								</h3>
							</a>
							<p className="flex-1 text-base leading-relaxed text-muted-foreground line-clamp-3">
								{post.excerpt}
							</p>
							{post.tags.length > 0 && (
								<div className="mt-auto flex flex-wrap gap-2 border-t border-border/50 pt-4">
									{post.tags.slice(0, 3).map((tag) => (
										<a
											href={`/tags/${tag.slug}`}
											className="inline-flex"
											key={tag._id}
										>
											<Button
												variant="outline"
												size="sm"
												className="text-xs transition-colors hover:bg-primary hover:text-primary-foreground"
											>
												{tag.title}
											</Button>
										</a>
									))}
									{post.tags.length > 3 && (
										<span className="inline-flex items-center text-xs text-muted-foreground">
											+{post.tags.length - 3} more
										</span>
									)}
								</div>
							)}
						</div>
					</div>
				))}
			</div>
			{hasMore && (
				<div className="mt-8 text-center">
					<Button onClick={loadMorePosts} disabled={isLoading}>
						{isLoading ? "Loading..." : "Load More"}
					</Button>
				</div>
			)}
		</div>
	);
}
