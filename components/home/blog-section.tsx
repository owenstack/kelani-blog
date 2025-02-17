import { sanityFetch } from "@/sanity/lib/fetch";
import { moreStoriesWithoutLimitQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { DateComponent } from "../date";

export async function BlogSection(params: { limit: number }) {
	const data = await sanityFetch({
		query: moreStoriesWithoutLimitQuery,
		params,
	});
	return (
		<section className="container px-4 mt-6 sm:mt-8 md:mt-16">
			<div className="grid gap-x-4 gap-y-6 sm:gap-y-8 md:grid-cols-2 lg:gap-x-6 lg:gap-y-12 2xl:grid-cols-3">
				{data?.map((post) => {
					const { _id, title, slug, coverImage, excerpt, author, date } = post;
					return (
						<Link
							key={_id}
							href={`/posts/${slug}`}
							className="group flex flex-col bg-card rounded-xl p-3 sm:p-4 hover:shadow-lg transition-all duration-300"
						>
							<div className="mb-3 sm:mb-4 flex overflow-clip rounded-lg">
								<div className="transition duration-300 group-hover:scale-105 w-full">
									<Image
										src={
											urlForImage(coverImage)
												?.height(1000)
												.width(2000)
												.url() as string
										}
										className="aspect-[3/2] h-full w-full object-cover object-center"
										width={2000}
										height={1000}
										alt={coverImage?.alt ?? ""}
										sizes="(min-width: 1536px) 33vw, (min-width: 768px) 50vw, 100vw"
									/>
								</div>
							</div>
							<div className="mb-2 line-clamp-2 break-words text-base font-medium sm:text-lg md:text-xl lg:text-2xl">
								{title}
							</div>
							{excerpt && (
								<div className="mb-3 sm:mb-4 line-clamp-2 text-xs sm:text-sm text-muted-foreground">
									{excerpt}
								</div>
							)}
							<div className="mt-auto flex items-center gap-2">
								{author && (
									<Image
										alt={author.picture?.alt ?? ""}
										className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
										height={48}
										width={48}
										src={
											urlForImage(author.picture)
												?.height(96)
												.width(96)
												.fit("crop")
												.url() as string
										}
									/>
								)}
								<div className="flex flex-col gap-px">
									<span className="text-xs sm:text-sm font-medium">
										{author?.name}
									</span>
									<span className="text-[10px] sm:text-xs text-muted-foreground">
										<DateComponent dateString={date} />
									</span>
								</div>
							</div>
						</Link>
					);
				})}
			</div>
		</section>
	);
}
