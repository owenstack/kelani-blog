import { defineField, defineType } from "sanity";
import { CommentIcon } from "@sanity/icons";

export default defineType({
	name: "comment",
	title: "Comment",
	icon: CommentIcon,
	type: "document",
	fields: [
		defineField({
			name: "name",
			title: "Name",
			type: "string",
			validation: (rule) => rule.required(),
			description: "Name of the person who left the comment",
		}),
		defineField({
			name: "email",
			title: "Email address",
			type: "string",
			validation: (rule) => rule.required(),
			description: "Email address of the person who left the comment",
		}),
		defineField({
			name: "comment",
			title: "Comment",
			type: "text",
			validation: (rule) => rule.required(),
			description: "Comment left by the person",
		}),
		defineField({
			name: "timestamp",
			title: "Timestamp",
			type: "datetime",
			initialValue: () => new Date().toISOString(),
		}),
		defineField({
			name: "post",
			type: "reference",
			to: [{ type: "post" }],
		}),
		defineField({
			name: "parentComment",
			title: "Parent Comment",
			type: "reference",
			to: [{ type: "comment" }],
			description: "Reference to parent comment if this is a reply",
		}),
		defineField({
			name: "likes",
			title: "Likes",
			type: "number",
			initialValue: 0,
		}),
		defineField({
			name: "dislikes",
			title: "Dislikes",
			type: "number",
			initialValue: 0,
		}),
		defineField({
			name: "likedBy",
			title: "Liked By",
			type: "array",
			of: [{ type: "string" }],
			description: "Array of user emails who liked this comment",
		}),
		defineField({
			name: "dislikedBy",
			title: "Disliked By",
			type: "array",
			of: [{ type: "string" }],
			description: "Array of user emails who disliked this comment",
		}),
	],
	preview: {
		select: {
			name: "name",
			comment: "comment",
			post: "post",
			parentComment: "parentComment",
		},
		prepare({ name, comment, post, parentComment }) {
			return {
				title: `${parentComment ? "Reply to comment" : "Comment"} on ${post} by ${name}`,
				subtitle: comment,
				description: comment,
			};
		},
	},
});
