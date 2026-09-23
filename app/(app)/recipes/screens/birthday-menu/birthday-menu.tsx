import { z } from "zod";
import {
	DEFAULT_IMAGE_HEIGHT,
	DEFAULT_IMAGE_WIDTH,
} from "@/lib/recipes/constants";
import type { RecipeDefinition } from "@/lib/recipes/types";
import { PreSatori } from "@/utils/pre-satori";

export const paramsSchema = z.object({
	mode: z
		.string()
		.default("apero")
		.describe("Sélectionner 'apero', 'plat' ou 'dessert'")
		.meta({ title: "Mode du Menu" }),
	sisterName: z
		.string()
		.default("Justine")
		.describe("Prénom de la personne fêtée")
		.meta({ title: "Prénom" }),
	age: z.number().default(30).describe("Âge célébré").meta({ title: "Âge" }),
	title: z
		.string()
		.default("")
		.describe("Laisser vide pour utiliser le titre par défaut du mode")
		.meta({ title: "Titre du Menu" }),
	item1: z.string().default("").meta({ title: "Plat 1 (Optionnel)" }),
	item2: z.string().default("").meta({ title: "Plat 2 (Optionnel)" }),
	item3: z.string().default("").meta({ title: "Plat 3 (Optionnel)" }),
	item4: z.string().default("").meta({ title: "Plat 4 (Optionnel)" }),
	item5: z.string().default("").meta({ title: "Plat 5 (Optionnel)" }),
});

export type BirthdayMenuParams = z.infer<typeof paramsSchema>;

interface BirthdayMenuProps {
	width?: number;
	height?: number;
	params?: Partial<BirthdayMenuParams>;
}

export function BirthdayMenu({
	width = DEFAULT_IMAGE_WIDTH,
	height = DEFAULT_IMAGE_HEIGHT,
	params,
}: BirthdayMenuProps) {
	// Parse the mode with a robust fallback
	const rawMode = (params?.mode || "apero").toLowerCase().trim();
	let mode: "apero" | "plat" | "dessert" = "apero";
	if (rawMode.includes("plat")) {
		mode = "plat";
	} else if (rawMode.includes("dessert")) {
		mode = "dessert";
	}

	// Preset definitions for each mode
	const PRESETS = {
		apero: {
			title: "L'Apéritif de Fête",
			items: [
				"Verrines Saumon Fumé / Tzatziki",
				"Verrines Ktipiti (Poivron / Féta)",
				"Escargots en pâte feuilletée au Pesto",
				"Feuilletés façon Pizza, Quiche Lorraine, tarte flambée",
				"Sacristains",
			],
		},
		plat: {
			title: "Le Plat Principal",
			items: ["Veau et spaetzles"],
		},
		dessert: {
			title: "Le Dessert",
			items: [
				"Féminin Fraise Framboise",
				"Tarte yuzu",
				"Barista",
				"glace café, praliné, chocolat et vanille",
			],
		},
	};

	const preset = PRESETS[mode];
	const sisterName = params?.sisterName || "Justine";
	const age = params?.age ?? 30;
	const menuTitle = params?.title || preset.title;

	// Collect user overrides (filter out empty inputs)
	const rawOverrides = [
		params?.item1,
		params?.item2,
		params?.item3,
		params?.item4,
		params?.item5,
	].filter(
		(item): item is string => typeof item === "string" && item.trim() !== "",
	);

	// Fallback to preset if no user overrides are configured
	const itemsToRender = rawOverrides.length > 0 ? rawOverrides : preset.items;

	// MenuItem helper function - dynamic font sizes and margins based on items count
	const renderMenuItem = (text: string, idx: number, totalItems: number) => {
		if (!text) return null;

		let fontSizeClass = "text-[22px]";
		let marginClass = "my-1.5";

		if (totalItems === 1) {
			fontSizeClass = "text-[32px]";
			marginClass = "my-6";
		} else if (totalItems === 2) {
			fontSizeClass = "text-[28px]";
			marginClass = "my-5";
		} else if (totalItems === 3) {
			fontSizeClass = "text-[25px]";
			marginClass = "my-4";
		}

		return (
			<div
				key={idx}
				className={`flex flex-col items-center text-center w-full ${marginClass}`}
			>
				<h3
					className={`font-inter font-black uppercase leading-tight text-black max-w-[650px] break-words ${fontSizeClass}`}
				>
					{text}
				</h3>
			</div>
		);
	};

	return (
		<PreSatori width={width} height={height}>
			<div className="w-full h-full p-3 bg-white flex flex-col items-center justify-center text-black font-inter">
				{/* Outer heavy border */}
				<div
					className="w-full h-full flex flex-col p-2"
					style={{
						borderWidth: 6,
						borderStyle: "solid",
						borderColor: "#000000",
						borderRadius: 16,
						boxSizing: "border-box",
					}}
				>
					{/* Inner thin border */}
					<div
						className="w-full h-full flex flex-col items-center p-6 relative"
						style={{
							borderWidth: 2,
							borderStyle: "solid",
							borderColor: "#000000",
							borderRadius: 8,
							boxSizing: "border-box",
						}}
					>
						{/* Decorative Corners */}
						<span className="absolute top-1 left-2 text-[10px] font-bold">
							~
						</span>
						<span className="absolute top-1 right-2 text-[10px] font-bold">
							~
						</span>
						<span className="absolute bottom-1 left-2 text-[10px] font-bold">
							~
						</span>
						<span className="absolute bottom-1 right-2 text-[10px] font-bold">
							~
						</span>

						{/* Header Section */}
						<div className="flex flex-col items-center w-full mt-1">
							<h1 className="font-inter text-[34px] font-black tracking-widest uppercase text-black leading-none text-center">
								{menuTitle}
							</h1>

							<div className="font-inter text-[18px] tracking-widest text-neutral-700 mt-2 uppercase font-semibold">
								Joyeux {age} ans, {sisterName} !
							</div>

							{/* Elegant divider */}
							<div className="flex items-center justify-center my-2.5 w-full max-w-[450px]">
								<div className="flex-1 h-[2px] bg-black"></div>
								<div className="mx-3 w-2.5 h-2.5 rounded-full bg-black"></div>
								<div className="flex-1 h-[2px] bg-black"></div>
							</div>
						</div>

						{/* Menu Items Container - vertically centered using my-auto */}
						<div className="flex flex-col justify-center items-center my-auto w-full">
							{itemsToRender.map((item, idx) =>
								renderMenuItem(item, idx, itemsToRender.length),
							)}
						</div>
					</div>
				</div>
			</div>
		</PreSatori>
	);
}

export const definition: RecipeDefinition<typeof paramsSchema> = {
	meta: {
		slug: "birthday-menu",
		title: "Birthday Menu",
		description:
			"A beautiful customizable birthday menu recipe screen, ideal for displaying on dinner/aperitif tables.",
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
