import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { client } from "@/sanity/lib/client";
import { env } from "@/lib/env";

export const { GET } = defineEnableDraftMode({
	client: client.withConfig({ token: env.SANITY_API_READ_TOKEN }),
});
