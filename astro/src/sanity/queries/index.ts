import { sanityClient } from "sanity:client";
import type * as sanityTypes from "@beyond-dogma/studio/sanity.types";
import { createGroqBuilder, makeSafeQueryRunner } from "groqd";

export const runQuery = makeSafeQueryRunner((query, { parameters }) =>
	sanityClient.fetch(query, parameters),
);

export const q = createGroqBuilder<{
	schemaTypes: sanityTypes.AllSanitySchemaTypes;
	referenceSymbol: typeof sanityTypes.internalGroqTypeReferenceTo;
}>();
