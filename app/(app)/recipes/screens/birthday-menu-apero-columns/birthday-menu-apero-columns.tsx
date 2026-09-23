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
		.default("L'Apéritif")
		.describe("Titre affiché en haut du menu")
		.meta({ title: "Titre du Menu" }),
	verrine1: z
		.string()
		.default("Saumon fumé / Tzatziki")
		.meta({ title: "Verrine 1" }),
	verrine2: z
		.string()
		.default("Ktipiti (Poivrons / Féta)")
		.meta({ title: "Verrine 2" }),
	verrine3: z
		.string()
		.default("Mousse de carotte et\nCrème de chou fleur")
		.meta({ title: "Verrine 3" }),
	verrine4: z
		.string()
		.default("Bisque de crevettes et pétoncles rôties")
		.meta({ title: "Verrine 4" }),
	verrine5: z
		.string()
		.default("Crème de betterave et chantilly chèvre")
		.meta({ title: "Verrine 5" }),
	feuillete1: z
		.string()
		.default("Spirales au Pesto")
		.meta({ title: "Feuilleté 1" }),
	feuillete2: z.string().default("Sacristains").meta({ title: "Feuilleté 2" }),
	feuillete3: z.string().default("Anchois").meta({ title: "Feuilleté 3" }),
	feuillete4: z
		.string()
		.default("Crackers sésame")
		.meta({ title: "Feuilleté 4" }),
	tartelette1: z.string().default("Flambées").meta({ title: "Tartelette 1" }),
	tartelette2: z.string().default("Oignons").meta({ title: "Tartelette 2" }),
	tartelette3: z.string().default("Quiches").meta({ title: "Tartelette 3" }),
	tartelette4: z.string().default("Pizzas").meta({ title: "Tartelette 4" }),
});

type Params = Partial<z.infer<typeof paramsSchema>>;

function BirthdayMenuAperoColumns({
	width = DEFAULT_IMAGE_WIDTH,
	height = DEFAULT_IMAGE_HEIGHT,
	params,
}: {
	width?: number;
	height?: number;
	params?: Params;
}) {
	// Extract parameters with default values based on the request
	const sisterName = params?.sisterName || "Justine";
	const age = params?.age ?? 30;
	const menuTitle = params?.title || "L'Apéritif";

	const verrines = [
		params?.verrine1 || "Saumon fumé / Tzatziki",
		params?.verrine2 || "Ktipiti (Poivrons / Féta)",
		params?.verrine3 || "Mousse de carotte et\nCrème de chou fleur",
		params?.verrine4 || "Bisque de crevettes et pétoncles rôties",
		params?.verrine5 || "Crème de betterave et chantilly chèvre",
	].filter(Boolean);

	const feuilletes = [
		params?.feuillete1 || "Spirales au Pesto",
		params?.feuillete2 || "Sacristains",
		params?.feuillete3 || "Anchois",
		params?.feuillete4 || "Crackers sésame",
	].filter(Boolean);

	const tartelettes = [
		params?.tartelette1 || "Flambées",
		params?.tartelette2 || "Oignons",
		params?.tartelette3 || "Quiches",
		params?.tartelette4 || "Pizzas",
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
						className="w-full h-full flex flex-col items-center pt-5 px-5 pb-3 relative justify-between"
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
						<div className="flex flex-col items-center w-full mt-0">
							<h1 className="font-inter text-[30px] font-black tracking-widest uppercase text-black leading-none text-center">
								{menuTitle}
							</h1>

							<div className="font-inter text-[16px] tracking-widest text-neutral-700 mt-1.5 uppercase font-semibold">
								Joyeux {age} ans, {sisterName} !
							</div>

							{/* Elegant divider */}
							<div className="flex items-center justify-center my-1.5 w-full max-w-[450px]">
								<div className="flex-1 h-[2px] bg-black"></div>
								<div className="mx-3 w-2.5 h-2.5 rounded-full bg-black"></div>
								<div className="flex-1 h-[2px] bg-black"></div>
							</div>
						</div>

						{/* Two-Column Middle Section */}
						<div className="flex flex-row w-full justify-between items-stretch my-1 flex-1">
							{/* Left Column - Verrines */}
							<div className="w-[47%] flex flex-col items-center">
								<h2
									className="font-inter text-[18px] font-extrabold tracking-widest uppercase text-black pb-1 mb-2 text-center"
									style={{ borderBottom: "2px solid #000000", width: "80%" }}
								>
									Les Verrines
								</h2>
								<div className="flex flex-col items-center justify-center flex-1 gap-2.5">
									{verrines.map((item, idx) => (
										<span
											key={idx}
											className="font-inter text-[16.5px] font-black text-center uppercase tracking-wide leading-tight max-w-[310px] break-words"
											style={{ whiteSpace: "pre-line" }}
										>
											{item}
										</span>
									))}
								</div>
							</div>

							{/* Vertical Separator */}
							<div
								style={{
									width: 2,
									backgroundColor: "#000000",
									alignSelf: "stretch",
									marginTop: 4,
									marginBottom: 4,
								}}
							/>

							{/* Right Column - Feuilletés */}
							<div className="w-[47%] flex flex-col items-center">
								<h2
									className="font-inter text-[18px] font-extrabold tracking-widest uppercase text-black pb-1 mb-2 text-center"
									style={{ borderBottom: "2px solid #000000", width: "80%" }}
								>
									Les Feuilletés
								</h2>
								<div className="flex flex-col items-center justify-center flex-1 gap-2.5">
									{feuilletes.map((item, idx) => (
										<span
											key={idx}
											className="font-inter text-[16.5px] font-black text-center uppercase tracking-wide leading-tight max-w-[310px] break-words"
											style={{ whiteSpace: "pre-line" }}
										>
											{item}
										</span>
									))}
								</div>
							</div>
						</div>

						{/* Bottom Section - Tartelettes */}
						<div className="flex flex-col items-center w-full mt-0.5">
							{/* Horizontal Divider */}
							<div className="w-[90%] h-[1.5px] bg-neutral-400 mb-1.5"></div>

							<h2
								className="font-inter text-[18px] font-extrabold tracking-widest uppercase text-black pb-1 mb-1.5 text-center"
								style={{ borderBottom: "2px solid #000000", width: "40%" }}
							>
								Les Tartelettes
							</h2>

							<div className="flex flex-row items-center justify-center gap-6">
								{tartelettes.map((item, idx) => (
									<React.Fragment key={idx}>
										<span className="font-inter text-[16.5px] font-black uppercase tracking-wider">
											{item}
										</span>
										{idx < tartelettes.length - 1 && (
											<span className="text-[14px] font-bold text-neutral-400">
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
		</PreSatori>
	);
}

export const definition: RecipeDefinition<typeof paramsSchema> = {
	meta: {
		slug: "birthday-menu-apero-columns",
		title: "Menu Apéritif 2 Colonnes",
		description:
			"Recette du menu d'apéritif d'anniversaire présenté sur 2 colonnes avec tartelettes en bas.",
		published: true,
		tags: ["menu", "birthday", "party", "customizable"],
		author: { name: "Antigravity", github: "" },
		category: "display-components",
		version: "0.1.0",
		createdAt: "2026-07-14T12:00:00Z",
		updatedAt: "2026-07-14T12:00:00Z",
		renderSettings: { supersample: true },
	},
	paramsSchema,
	dataSchema: paramsSchema,
	Component: ({ width, height, params }) => (
		<BirthdayMenuAperoColumns width={width} height={height} params={params} />
	),
};
