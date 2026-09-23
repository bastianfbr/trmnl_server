import { z } from "zod";
import {
	DEFAULT_IMAGE_HEIGHT,
	DEFAULT_IMAGE_WIDTH,
} from "@/lib/recipes/constants";
import type { RecipeDefinition } from "@/lib/recipes/types";
import { PreSatori } from "@/utils/pre-satori";

export const paramsSchema = z.object({
	sisterName: z
		.string()
		.default("Justine")
		.describe("Prénom de la personne fêtée")
		.meta({ title: "Prénom" }),
	age: z.number().default(30).describe("Âge célébré").meta({ title: "Âge" }),
	title: z
		.string()
		.default("Les Desserts")
		.describe("Titre affiché en haut du menu")
		.meta({ title: "Titre du Menu" }),
	dessert1: z
		.string()
		.default("Féminin fraise-framboise")
		.meta({ title: "Dessert 1" }),
	dessert1Desc: z
		.string()
		.default(
			"Mousse fromage blanc, panna cotta citron vert, compotée fraise-framboise, biscuit amandes",
		)
		.meta({ title: "Dessert 1 Description" }),
	dessert2: z.string().default("Tarte yuzu").meta({ title: "Dessert 2" }),
	dessert2Desc: z
		.string()
		.default("Fond sablé, crémeux citron, meringue au yuzu")
		.meta({ title: "Dessert 2 Description" }),
	dessert3: z.string().default("Barista").meta({ title: "Dessert 3" }),
	dessert3Desc: z
		.string()
		.default(
			"Biscuit noisette, croustillant gianduja, crémeux cappuccino, ganaches café et noisette",
		)
		.meta({ title: "Dessert 3 Description" }),
	glace1: z.string().default("Vanille").meta({ title: "Glace 1" }),
	glace2: z.string().default("Chocolat").meta({ title: "Glace 2" }),
	glace3: z.string().default("Café").meta({ title: "Glace 3" }),
	glace4: z.string().default("Praliné").meta({ title: "Glace 4" }),
	glace5: z.string().default("Citron vert").meta({ title: "Glace 5" }),
	glace6: z.string().default("Orange sanguine").meta({ title: "Glace 6" }),
	glaceSubtitle: z
		.string()
		.default("(coupelles gaufrette en chocolat)")
		.meta({ title: "Sous-titre des glaces" }),
});

type Params = Partial<z.infer<typeof paramsSchema>>;

function BirthdayMenuDessertColumns({
	width = DEFAULT_IMAGE_WIDTH,
	height = DEFAULT_IMAGE_HEIGHT,
	params,
}: {
	width?: number;
	height?: number;
	params?: Params;
}) {
	// Extract parameters with default values
	const sisterName = params?.sisterName || "Justine";
	const age = params?.age ?? 30;
	const menuTitle = params?.title || "Les Desserts";
	const glaceSubtitle =
		params?.glaceSubtitle || "(coupelles gaufrette en chocolat)";

	const desserts = [
		{
			title: params?.dessert1 || "Féminin fraise-framboise",
			desc:
				params?.dessert1Desc ||
				"Mousse fromage blanc, panna cotta citron vert, compotée fraise-framboise, biscuit amandes",
		},
		{
			title: params?.dessert2 || "Tarte yuzu",
			desc:
				params?.dessert2Desc || "Fond sablé, crémeux citron, meringue au yuzu",
		},
		{
			title: params?.dessert3 || "Barista",
			desc:
				params?.dessert3Desc ||
				"Biscuit noisette, croustillant gianduja, crémeux cappuccino, ganaches café et noisette",
		},
	].filter((d) => d.title);

	const glacesLine1 = [
		params?.glace1 || "Vanille",
		params?.glace2 || "Chocolat",
		params?.glace3 || "Café",
		params?.glace4 || "Praliné",
	].filter(Boolean);

	const glacesLine2 = [
		params?.glace5 || "Citron vert",
		params?.glace6 || "Orange sanguine",
	].filter(Boolean);

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
						className="w-full h-full flex flex-col items-center p-5 relative justify-start gap-1.5"
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
						<div className="flex flex-col items-center w-full mt-0.5">
							<h1 className="font-inter text-[30px] font-black tracking-widest uppercase text-black leading-none text-center">
								{menuTitle}
							</h1>

							<div className="font-inter text-[16px] tracking-widest text-neutral-700 mt-1 uppercase font-semibold">
								Joyeux {age} ans, {sisterName} !
							</div>

							{/* Elegant divider */}
							<div className="flex items-center justify-center my-1.5 w-full max-w-[450px]">
								<div className="flex-1 h-[2px] bg-black"></div>
								<div className="mx-3 w-2.5 h-2.5 rounded-full bg-black"></div>
								<div className="flex-1 h-[2px] bg-black"></div>
							</div>
						</div>

						{/* Line-based (row) Middle Section */}
						<div className="flex flex-col w-full flex-grow justify-start px-4 pt-1 gap-2">
							{/* Pâtisseries Section Header */}
							<div className="flex flex-row items-center w-full pb-1">
								<h2
									className="font-inter text-[18px] font-extrabold tracking-widest uppercase text-black pb-1 mb-1"
									style={{
										borderBottom: "2px solid #000000",
										alignSelf: "flex-start",
									}}
								>
									Les Pâtisseries
								</h2>
							</div>

							{/* Pastry Rows */}
							<div className="flex flex-col w-full gap-2">
								{desserts.map((item, idx) => (
									<div
										key={idx}
										className="flex flex-row w-full items-start justify-between py-1 border-b border-dashed border-neutral-300 last:border-b-0"
									>
										{/* Title Left */}
										<div className="w-[38%] flex items-start pr-2 mt-0.5">
											<span className="font-inter text-[18px] font-black uppercase tracking-wide text-left leading-tight">
												{item.title}
											</span>
										</div>

										{/* Description Right */}
										<div className="w-[60%] flex items-start pl-2">
											<span className="font-inter text-[17px] font-bold text-black text-left leading-snug">
												{item.desc}
											</span>
										</div>
									</div>
								))}
							</div>

							{/* Glaces / Sorbets Row Section */}
							<div
								className="flex flex-row w-full items-center justify-between mt-auto pt-2.5 pb-0.5"
								style={{ borderTop: "2px solid #000000" }}
							>
								{/* Title Left */}
								<div className="w-[38%] flex flex-col items-start pr-2">
									<h2
										className="font-inter text-[18px] font-black uppercase tracking-widest text-left leading-tight pb-1 mb-1"
										style={{ borderBottom: "2px solid #000000" }}
									>
										Les Glaces / Sorbets
									</h2>
									{glaceSubtitle && (
										<span className="font-inter text-[16px] font-bold text-neutral-800 text-left leading-none mt-1">
											{glaceSubtitle}
										</span>
									)}
								</div>

								{/* Flavors Right */}
								<div className="w-[60%] flex flex-col items-start justify-center pl-2 gap-1">
									<span className="font-inter text-[16px] font-black uppercase tracking-wider text-black text-left leading-tight">
										{glacesLine1.join("  •  ")}
									</span>
									<span className="font-inter text-[16px] font-black uppercase tracking-wider text-black text-left leading-tight">
										{glacesLine2.join("  •  ")}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</PreSatori>
	);
}

export const definition: RecipeDefinition<typeof paramsSchema> = {
	meta: {
		slug: "birthday-menu-dessert-columns",
		title: "Menu Dessert 2 Colonnes",
		description:
			"Recette du menu dessert d'anniversaire présenté sur 2 colonnes (desserts à gauche, glaces à droite).",
		published: true,
		tags: ["menu", "birthday", "party", "customizable"],
		author: { name: "Antigravity", github: "" },
		category: "display-components",
		version: "0.1.0",
		createdAt: "2026-07-14T14:30:00Z",
		updatedAt: "2026-07-14T14:30:00Z",
		renderSettings: { supersample: true },
	},
	paramsSchema,
	dataSchema: paramsSchema,
	Component: ({ width, height, params }) => (
		<BirthdayMenuDessertColumns width={width} height={height} params={params} />
	),
};
