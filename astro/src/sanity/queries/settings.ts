import { z } from "groqd";
import { q } from ".";

export const siteSettingsQuery = q.star
	.filterByType("settings")
	.project((sub) => ({
		title: z.string(),
		description: z.string(),
		ogImage: sub.field("ogImage.asset").deref().field("url").as<string>(),
		socialLinks: sub.field("socialLinks[]"),
	}));
