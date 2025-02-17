import type { Metadata, ResolvingMetadata } from "next";
import { defineQuery } from "next-sanity";
import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { DateComponent } from "@/components/date";
import { MoreStories } from "@/components/more-stories";
import { CustomPortableText } from "@/components/portable-text";

import Facebook from "@/assets/icons/facebook";
import Instagram from "@/assets/icons/instagram";
import LinkedIn from "@/assets/icons/linkedin";
import Twitter from "@/assets/icons/twitter";
import { ShareCard } from "@/components/home/share-card";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { urlForImage } from "@/sanity/lib/utils";
import { ArrowUp } from "lucide-react";
import Image from "next/image";

type Props = {
	params: Promise<{ slug: string }>;
};

const postSlugs = defineQuery(
	`*[_type == "post" && defined(slug.current)]{"slug": slug.current}`,
);

export async function generateStaticParams() {
	return await sanityFetch({
		query: postSlugs,
		perspective: "published",
		stega: false,
	});
}

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const post = await sanityFetch({
		query: postQuery,
		params,
		stega: false,
	});
	const previousImages = (await parent).openGraph?.images || [];
	const ogImage = resolveOpenGraphImage(post?.coverImage);

	return {
		authors: post?.author?.name ? [{ name: post?.author?.name }] : [],
		title: post?.title,
		description: post?.excerpt,
		openGraph: {
			images: ogImage ? [ogImage, ...previousImages] : previousImages,
		},
	} satisfies Metadata;
}

export default async function PostPage({ params }: Props) {
	const post = await sanityFetch({ query: postQuery, params });

	if (!post?._id) {
		return notFound();
	}
	return (
		<section className="py-10 md:py-24 lg:py-20 scroll-smooth">
			<div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h1
					className="mb-8 mt-8 max-w-4xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
					id="title"
				>
					{post.title}
				</h1>
				<div className="flex items-center gap-4 text-sm">
					{post?.author ? (
						<Image
							alt={post?.author.picture?.alt ?? ""}
							className="h-10 w-10 rounded-full object-cover ring-2 ring-background"
							height={48}
							width={48}
							src={
								urlForImage(post?.author.picture)
									?.height(96)
									.width(96)
									.fit("crop")
									.url() as string
							}
						/>
					) : null}
					<div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
						<span className="font-medium">{post.author?.name}</span>
						<span className="text-muted-foreground">
							<DateComponent dateString={post.date} />
						</span>
					</div>
				</div>
				<div className="my-12 h-px w-full bg-border" />
				<div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12">
					<article className="prose prose-gray dark:prose-invert lg:col-span-8 max-w-none">
						{post.content?.length && (
							<CustomPortableText value={post.content as PortableTextBlock[]} />
						)}
					</article>
					<ShareCard title={post.title} />
				</div>
				<aside className="mt-24">
					<div className="h-px w-full bg-border" />
					<h2 className="my-12 text-3xl font-bold tracking-tight md:text-4xl">
						More stories
					</h2>
					<Suspense>
						<MoreStories skip={post._id} limit={2} />
					</Suspense>
				</aside>
			</div>
		</section>
	);
}
