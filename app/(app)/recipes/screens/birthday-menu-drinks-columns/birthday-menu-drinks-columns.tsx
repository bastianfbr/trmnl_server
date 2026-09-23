import React from "react";
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
		.default("Les Boissons")
		.describe("Titre affiché en haut du menu")
		.meta({ title: "Titre du Menu" }),
	col1Title: z
		.string()
		.default("Les Bulles / Bières")
		.meta({ title: "Titre Colonne 1" }),
	col2Title: z.string().default("Les Softs").meta({ title: "Titre Colonne 2" }),
	col3Title: z
		.string()
		.default("Les Jus / Eaux")
		.meta({ title: "Titre Colonne 3" }),
	drink_c1_1: z
		.string()
		.default("Champagne Lejeune Rosé")
		.meta({ title: "Boisson Col 1 - 1" }),
	drink_c1_2: z
		.string()
		.default("Champagne Lejeune\nBlanc de Blancs")
		.meta({ title: "Boisson Col 1 - 2" }),
	drink_c1_3: z
		.string()
		.default("Bière Hoegaarden Blanche")
		.meta({ title: "Boisson Col 1 - 3" }),
	drink_c2_1: z
		.string()
		.default("Pepsi Max")
		.meta({ title: "Boisson Col 2 - 1" }),
	drink_c2_2: z
		.string()
		.default("Oasis Fraise / Framboise")
		.meta({ title: "Boisson Col 2 - 2" }),
	drink_c2_3: z
		.string()
		.default("Oasis Pomme / Poire")
		.meta({ title: "Boisson Col 2 - 3" }),
	drink_c2_4: z
		.string()
		.default("Fuze Tea Pêche")
		.meta({ title: "Boisson Col 2 - 4" }),
	drink_c2_5: z
		.string()
		.default("Fuze Tea Pêche Hibiscus")
		.meta({ title: "Boisson Col 2 - 5" }),
	drink_c3_1: z
		.string()
		.default("Jus d’Orange")
		.meta({ title: "Boisson Col 3 - 1" }),
	drink_c3_2: z
		.string()
		.default("Jus de Pomme")
		.meta({ title: "Boisson Col 3 - 2" }),
	drink_c3_3: z
		.string()
		.default("Eau Plate")
		.meta({ title: "Boisson Col 3 - 3" }),
	drink_c3_4: z
		.string()
		.default("Eau Gazeuse")
		.meta({ title: "Boisson Col 3 - 4" }),
});

type Params = Partial<z.infer<typeof paramsSchema>>;

function BirthdayMenuDrinksColumns({
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
	const menuTitle = params?.title || "Les Boissons";

	const col1Title = params?.col1Title || "Les Bulles / Bières";
	const col2Title = params?.col2Title || "Les Softs";
	const col3Title = params?.col3Title || "Les Jus / Eaux";

	const col1Drinks = [
		params?.drink_c1_1 || "Champagne Lejeune Rosé",
		params?.drink_c1_2 || "Champagne Lejeune\nBlanc de Blancs",
		params?.drink_c1_3 || "Bière Hoegaarden Blanche",
	].filter(Boolean) as string[];

	const col2Drinks = [
		params?.drink_c2_1 || "Pepsi Max",
		params?.drink_c2_2 || "Oasis Fraise / Framboise",
		params?.drink_c2_3 || "Oasis Pomme / Poire",
		params?.drink_c2_4 || "Fuze Tea Pêche",
		params?.drink_c2_5 || "Fuze Tea Pêche Hibiscus",
	].filter(Boolean) as string[];

	const col3Drinks = [
		params?.drink_c3_1 || "Jus d’Orange",
		params?.drink_c3_2 || "Jus de Pomme",
		params?.drink_c3_3 || "Eau Plate",
		params?.drink_c3_4 || "Eau Gazeuse",
	].filter(Boolean) as string[];

	const isLarge = width > 1500;

	return (
		<PreSatori width={width} height={height}>
			<div className="w-full h-full p-3 2xl:p-8 bg-[#0A1128] flex flex-col items-center justify-center text-white font-inter">
				{/* Outer heavy border */}
				<div
					className="w-full h-full flex flex-col p-2 2xl:p-5"
					style={{
						borderWidth: isLarge ? 24 : 6,
						borderStyle: "solid",
						borderColor: "#D4B26F",
						borderRadius: isLarge ? 48 : 16,
						boxSizing: "border-box",
					}}
				>
					{/* Inner thin border */}
					<div
						className="w-full h-full flex flex-col items-center pt-5 2xl:pt-16 px-5 2xl:px-12 pb-3 2xl:pb-8 relative justify-start"
						style={{
							borderWidth: isLarge ? 8 : 2,
							borderStyle: "solid",
							borderColor: "#D4B26F",
							borderRadius: isLarge ? 24 : 8,
							boxSizing: "border-box",
						}}
					>
						{/* Decorative Corners */}
						<span className="absolute top-1 2xl:top-4 left-2 2xl:left-8 text-[10px] 2xl:text-[36px] font-bold text-[#D4B26F]">
							~
						</span>
						<span className="absolute top-1 2xl:top-4 right-2 2xl:right-8 text-[10px] 2xl:text-[36px] font-bold text-[#D4B26F]">
							~
						</span>
						<span className="absolute bottom-1 2xl:bottom-4 left-2 2xl:left-8 text-[10px] 2xl:text-[36px] font-bold text-[#D4B26F]">
							~
						</span>
						<span className="absolute bottom-1 2xl:bottom-4 right-2 2xl:right-8 text-[10px] 2xl:text-[36px] font-bold text-[#D4B26F]">
							~
						</span>

						{/* Header Section */}
						<div className="flex flex-col items-center w-full mt-0">
							<h1 className="font-inter text-[30px] lg:text-[45px] 2xl:text-[100px] font-black tracking-widest uppercase text-[#D4B26F] leading-none text-center">
								{menuTitle}
							</h1>

							<div className="font-inter text-[16px] lg:text-[22px] 2xl:text-[54px] tracking-widest text-[#E5D3B3] mt-1.5 2xl:mt-4 uppercase font-semibold">
								Joyeux {age} ans, {sisterName} !
							</div>

							{/* Elegant divider */}
							<div className="flex items-center justify-center my-1.5 2xl:my-6 w-full max-w-[450px] 2xl:max-w-[1000px]">
								<div className="flex-1 h-[2px] 2xl:h-[5px] bg-[#D4B26F]"></div>
								<div className="mx-3 2xl:mx-6 w-2.5 h-2.5 2xl:w-6 2xl:h-6 rounded-full bg-[#D4B26F]"></div>
								<div className="flex-1 h-[2px] 2xl:h-[5px] bg-[#D4B26F]"></div>
							</div>
						</div>

						{/* Bento Grid Content Section */}
						<div className="flex flex-col w-full flex-grow mt-2 2xl:mt-10 justify-between gap-4 2xl:gap-8 pb-1">
							{/* Top Row: Two side-by-side cards */}
							<div className="flex flex-row w-full justify-between items-stretch flex-1 gap-4 2xl:gap-8">
								{/* Card 1: Bulles & Bières */}
								<div
									className="w-[48%] flex flex-col bg-[#131F37] overflow-hidden"
									style={{
										borderWidth: isLarge ? 8 : 3,
										borderStyle: "solid",
										borderColor: "#D4B26F",
										borderRadius: isLarge ? 24 : 12,
									}}
								>
									<div className="font-inter bg-[#D4B26F] text-[#0A1128] py-2 2xl:py-9 w-full text-center font-bold uppercase tracking-widest text-[16px] lg:text-[20px] 2xl:text-[76px] leading-tight">
										{col1Title}
									</div>
									<div className="flex flex-col items-center justify-center flex-grow p-4 2xl:p-8 gap-4 2xl:gap-16">
										{col1Drinks.map((item, idx) => (
											<span
												key={idx}
												className="font-inter text-[16px] lg:text-[20px] 2xl:text-[68px] font-black text-center uppercase tracking-wide leading-tight break-words max-w-full text-white"
												style={{ whiteSpace: "pre-line" }}
											>
												{item}
											</span>
										))}
									</div>
								</div>

								{/* Card 2: Softs */}
								<div
									className="w-[48%] flex flex-col bg-[#131F37] overflow-hidden"
									style={{
										borderWidth: isLarge ? 8 : 3,
										borderStyle: "solid",
										borderColor: "#D4B26F",
										borderRadius: isLarge ? 24 : 12,
									}}
								>
									<div className="font-inter bg-[#D4B26F] text-[#0A1128] py-2 2xl:py-9 w-full text-center font-bold uppercase tracking-widest text-[16px] lg:text-[20px] 2xl:text-[76px] leading-tight">
										{col2Title}
									</div>
									<div className="flex flex-col items-center justify-center flex-grow p-4 2xl:p-8 gap-3 2xl:gap-12">
										{col2Drinks.map((item, idx) => (
											<span
												key={idx}
												className="font-inter text-[16px] lg:text-[20px] 2xl:text-[68px] font-black text-center uppercase tracking-wide leading-tight break-words max-w-full text-white"
												style={{ whiteSpace: "pre-line" }}
											>
												{item}
											</span>
										))}
									</div>
								</div>
							</div>

							{/* Bottom Row: Full width card */}
							<div
								className="w-full flex flex-col bg-[#131F37] overflow-hidden h-[33%] 2xl:h-[35%]"
								style={{
									borderWidth: isLarge ? 8 : 3,
									borderStyle: "solid",
									borderColor: "#D4B26F",
									borderRadius: isLarge ? 24 : 12,
								}}
							>
								<div className="font-inter bg-[#D4B26F] text-[#0A1128] py-2 2xl:py-9 w-full text-center font-bold uppercase tracking-widest text-[16px] lg:text-[20px] 2xl:text-[76px] leading-tight">
									{col3Title}
								</div>
								<div className="flex flex-row flex-wrap items-center justify-center flex-grow p-4 2xl:p-8 px-6 2xl:px-16 gap-x-6 lg:gap-x-8 2xl:gap-x-16 gap-y-3 2xl:gap-y-6">
									{col3Drinks.map((item, idx) => (
										<React.Fragment key={idx}>
											<span className="font-inter text-[16px] lg:text-[20px] 2xl:text-[68px] font-black text-center uppercase tracking-wide leading-none break-words text-white">
												{item}
											</span>
											{idx < col3Drinks.length - 1 && (
												<span className="text-[16px] lg:text-[20px] 2xl:text-[68px] font-black text-[#D4B26F] leading-none">
													•
												</span>
											)}
										</React.Fragment>
									))}
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
		slug: "birthday-menu-drinks-columns",
		title: "Menu Boissons 3 Colonnes",
		description:
			"Recette du menu des boissons d'anniversaire présenté sur 3 colonnes pour grand écran.",
		published: true,
		tags: ["menu", "birthday", "party", "customizable"],
		author: { name: "Antigravity", github: "" },
		category: "display-components",
		version: "0.1.0",
		createdAt: "2026-07-15T12:00:00Z",
		updatedAt: "2026-07-15T12:00:00Z",
		renderSettings: { supersample: true },
	},
	paramsSchema,
	dataSchema: paramsSchema,
	Component: ({ width, height, params }) => (
		<BirthdayMenuDrinksColumns width={width} height={height} params={params} />
	),
};
