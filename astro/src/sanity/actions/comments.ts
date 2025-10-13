import type * as sanityTypes from "@beyond-dogma/studio/sanity.types";
import { sanityServerClient } from ".";

type CreateComment = Omit<
	sanityTypes.Comment,
	| "_rev"
	| "_type"
	| "_id"
	| "_createdAt"
	| "_updatedAt"
	| "likes"
	| "dislikes"
	| "timestamp"
	| "likedBy"
	| "dislikedBy"
>;

export async function createComment(data: CreateComment) {
	try {
		await sanityServerClient.create({
			_type: "comment",
			...data,
		});
	} catch (error) {
		console.error("Error creating comment: ", error);
	}
}
