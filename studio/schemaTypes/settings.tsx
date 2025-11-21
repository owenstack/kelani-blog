import { CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Settings schema Singleton.  Singletons are single documents that are displayed not in a collection, handy for things like site settings and other global configurations.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export default defineType({
	name: "settings",
	title: "Settings",
	type: "document",
	icon: CogIcon,
	fields: [
		defineField({
			name: "title",
			description: "This field is the title of your blog.",
			title: "Title",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "description",
			description: "Used on the Homepage",
			title: "Description",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "ogImage",
			title: "Open Graph Image",
			type: "image",
			description: "Displayed on social cards and search engine results.",
			options: {
				hotspot: true,
			},
			fields: [
				defineField({
					name: "alt",
					description: "Important for accessibility and SEO.",
					title: "Alternative text",
					type: "string",
					validation: (rule) => {
						return rule.custom((alt, context) => {
							if ((context.document?.ogImage as any)?.asset?._ref && !alt) {
								return "Required";
							}
							return true;
						});
					},
				}),
			],
		}),
		defineField({
			name: "socialLinks",
			title: "Social Media Links",
			type: "array",
			description: "Social media links displayed in the navigation.",
			of: [
				{
					type: "object",
					fields: [
						defineField({
							name: "title",
							title: "Title",
							type: "string",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "url",
							title: "URL",
							type: "url",
							validation: (rule) => rule.required().uri({ scheme: ["http", "https", "mailto"] }),
						}),
					],
					preview: {
						select: {
							title: "title",
							subtitle: "url",
						},
					},
				},
			],
		}),
	],
	preview: {
		prepare() {
			return {
				title: "Settings",
			};
		},
	},
});
