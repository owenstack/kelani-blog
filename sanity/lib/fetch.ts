import type { ClientPerspective, Mutation, QueryParams } from "next-sanity";
import { draftMode } from "next/headers";

import { client } from "@/sanity/lib/client";
import { env } from "@/lib/env";

export async function sanityFetch<const QueryString extends string>({
	query,
	params = {},
	perspective: _perspective,
	stega: _stega,
}: {
	query: QueryString;
	params?: QueryParams | Promise<QueryParams>;
	perspective?: Omit<ClientPerspective, "raw">;
	stega?: boolean;
}) {
	const perspective =
		_perspective || (await draftMode()).isEnabled
			? "previewDrafts"
			: "published";
	const stega =
		_stega ||
		perspective === "previewDrafts" ||
		process.env.VERCEL_ENV === "preview";
	if (perspective === "previewDrafts") {
		return client.fetch(query, await params, {
			stega,
			perspective: "previewDrafts",
			token: env.SANITY_API_READ_TOKEN,
			useCdn: false,
			next: { revalidate: 0 },
		});
	}
	return client.fetch(query, await params, {
		stega,
		perspective: "published",
		useCdn: true,
		next: { revalidate: 60 },
	});
}

export async function sanityMutate<T extends Mutation<Record<string, any>>>({
	mutations,
}: {
	mutations: T[];
}) {
	return client.mutate(mutations, {
		token: env.SANITY_API_WRITE_TOKEN,
	});
}

export async function sanityCreate<T extends Record<string, any>>({
	_type,
	data,
}: {
	_type: string;
	data: T;
}) {
	return client.create(
		{ _type, ...data },
		{
			token: env.SANITY_API_WRITE_TOKEN,
		},
	);
}

export async function sanityDelete(id: string) {
	return client.delete(id, {
		token: env.SANITY_API_WRITE_TOKEN,
	});
}

export async function sanityPatch(id: string, patch: Record<string, any>) {
	return client.patch(id).set(patch).commit({
		token: env.SANITY_API_WRITE_TOKEN,
	});
}
