import { defineField, defineType } from "sanity";
import { CommentIcon } from "@sanity/icons";

export default defineType({
	name: "comment",
	title: "Comment",
	icon: CommentIcon,
	type: "document",
	fields: [
		defineField({
			name: "userId",
			title: "User ID",
			type: "string",
			validation: (rule) => rule.required(),
			description: "User ID to link user to their field in the database",
		}),
		defineField({
			name: "username",
			title: "Username",
			type: "string",
			validation: (rule) => rule.required(),
			description: "Name of the person who left the comment",
		}),
		defineField({
			name: "email",
			title: "Email address",
			type: "string",
			validation: (rule) => rule.required().email(),
			description: "Email address of the person who left the comment",
		}),
		defineField({
			name: "comment",
			title: "Comment",
			type: "text",
			validation: (rule) => rule.required().min(1).max(1000),
			description: "Comment left by the person",
		}),
		defineField({
			name: "timestamp",
			title: "Timestamp",
			type: "datetime",
			initialValue: () => new Date().toISOString(),
			readOnly: true,
		}),
		defineField({
			name: "post",
			type: "reference",
			to: [{ type: "post" }],
			validation: (rule) => rule.required(),
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
			readOnly: true,
		}),
		defineField({
			name: "dislikes",
			title: "Dislikes",
			type: "number",
			initialValue: 0,
			readOnly: true,
		}),
		defineField({
			name: "likedBy",
			title: "Liked By",
			type: "array",
			of: [{ type: "string" }],
			description: "Array of user emails who liked this comment",
			readOnly: true,
		}),
		defineField({
			name: "dislikedBy",
			title: "Disliked By",
			type: "array",
			of: [{ type: "string" }],
			description: "Array of user emails who disliked this comment",
			readOnly: true,
		}),
	],
	preview: {
		select: {
			username: "username",
			comment: "comment",
			post: "post.title",
			parentComment: "parentComment",
		},
		prepare({ username, comment, post, parentComment }) {
			return {
				title: `${parentComment ? "Reply to comment" : "Comment"} on "${post}" by ${username}`,
				subtitle: comment,
				description: comment,
			};
		},
	},
});
