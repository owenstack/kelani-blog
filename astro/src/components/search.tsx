import { actions } from "astro:actions";
import { Loader2, Search } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./ui/sheet";

export function SearchSheet() {
	const [tags, setTags] = useState<
		{ _id: string; title: string; slug: string }[]
	>([]);
	const [posts, setPosts] = useState<
		| {
				_id: string;
				title: string;
				slug: string;
				coverImage: string;
				excerpt: string;
		  }[]
		| null
	>(null);
	const [loading, setLoading] = useState(false);
	const handleClick = () => {
		// Don't await, let the sheet open instantly.
		// The tags will be populated when the fetch completes.
		// If there's old data in `tags`, it will be shown until the new data arrives.
		actions.queries.fetchTags().then(({ data, error }) => {
			if (error) {
				toast.error(error.code, {
					description: error.message,
				});
				return;
			}
			if (data) {
				setTags(data);
			}
		});
	};

	const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const query = formData.get("query") as string;
		if (query.trim().length > 0) {
			setLoading(true);
			setPosts(null);
			const { data, error } = await actions.queries.queryPosts({
				query: query.trim(),
			});
			if (error) {
				toast.error(error.code, { description: error.message });
				setLoading(false);
				return;
			}
			setPosts(data);
			setLoading(false);
			return;
		}
		setPosts(null);
	};
	return (
		<Sheet>
			<SheetTrigger
				onClick={handleClick}
				className={buttonVariants({ variant: "ghost" })}
			>
				<Search className="size-4" />
			</SheetTrigger>
			<SheetContent className="p-4">
				<SheetHeader>
					<SheetTitle className="sr-only">Search posts</SheetTitle>
					<form onSubmit={handleSearch} className="mb-4">
						<Input autoFocus name="query" placeholder="Search" />
					</form>
				</SheetHeader>
				<div className="flex flex-wrap gap-2">
					{tags.map((tag) => (
						<a
							key={tag._id}
							href={`/tags/${tag.slug}`}
							className={buttonVariants({ variant: "outline" })}
						>
							{tag.title}
						</a>
					))}
				</div>
				<Separator className="my-4" />
				{loading && (
					<span className="flex items-center gap-2">
						<Loader2 className="size-4 animate-spin" />
						<p className="text-sm text-muted-foreground">Searching...</p>
					</span>
				)}
				{!loading && posts?.length === 0 && (
					<p className="text-sm text-muted-foreground">
						No posts found. Try a different search.
					</p>
				)}
				{!loading && posts && posts.length > 0 && (
					<div className="flex flex-col gap-4">
						{posts.map((post) => (
							<a
								key={post._id}
								href={`/posts/${post.slug}`}
								className="flex items-center gap-4 rounded-lg border p-2 transition-colors hover:bg-muted/50"
							>
								<img
									src={post.coverImage}
									alt={post.title}
									className="size-24 rounded-md object-cover"
								/>
								<div className="flex flex-col gap-1">
									<h3 className="font-semibold leading-none tracking-tight">
										{post.title}
									</h3>
									<p className="line-clamp-2 text-sm text-muted-foreground">
										{post.excerpt}
									</p>
								</div>
							</a>
						))}
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
