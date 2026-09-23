import { z } from "zod";
import type { RecipeDefinition } from "@/lib/recipes/types";
import {
	BirthdayMenu,
	paramsSchema as baseParamsSchema,
} from "../birthday-menu/birthday-menu";

export const paramsSchema = baseParamsSchema.extend({
	mode: z
		.string()
		.default("dessert")
		.describe("Sélectionner 'apero', 'plat' ou 'dessert'")
		.meta({ title: "Mode du Menu" }),
});

export const definition: RecipeDefinition<typeof paramsSchema> = {
	meta: {
		slug: "birthday-menu-dessert",
		title: "Menu Dessert Justine",
		description:
			"Recette du menu dessert d'anniversaire pour Justine sur TRMNL.",
		published: true,
		tags: ["menu", "birthday", "party", "customizable"],
		author: { name: "Antigravity", github: "" },
		category: "display-components",
		version: "0.1.0",
		createdAt: "2026-06-29T12:00:00Z",
		updatedAt: "2026-06-29T12:00:00Z",
		renderSettings: { supersample: true },
	},
	paramsSchema,
	dataSchema: paramsSchema,
	Component: ({ width, height, params }) => (
		<BirthdayMenu width={width} height={height} params={params} />
	),
};
