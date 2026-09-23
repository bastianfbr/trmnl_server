import React from "react";
import { z } from "zod";
import {
	DEFAULT_IMAGE_HEIGHT,
	DEFAULT_IMAGE_WIDTH,
} from "@/lib/recipes/constants";
import type { RecipeDefinition } from "@/lib/recipes/types";
import { PreSatori } from "@/utils/pre-satori";
import getStarMeteoDataInternal from "./getData";

export const paramsSchema = z.object({
	location: z
		.string()
		.default("Paris")
		.describe("City or place name to fetch weather for")
		.meta({ title: "Location", placeholder: "Paris" }),
});

export const dataSchema = z.object({
	currentMax: z.string().default("23"),
	currentMin: z.string().default("12"),
	currentIcon: z.string().default("sun-cloud"),
	time: z.string().default("12:34"),
	probeTemp: z.string().default("17.3"),
	forecastTomorrowMax: z.string().default("20"),
	forecastTomorrowMin: z.string().default("10"),
	forecastTomorrowIcon: z.string().default("sun-cloud"),
	forecastDay3Max: z.string().default("17"),
	forecastDay3Min: z.string().default("8"),
	forecastDay3Icon: z.string().default("cloud"),
	forecastDay4Max: z.string().default("19"),
	forecastDay4Min: z.string().default("10"),
	forecastDay4Icon: z.string().default("rain"),
});

interface StarMeteoProps {
	currentMax?: string;
	currentMin?: string;
	currentIcon?: string;
	time?: string;
	probeTemp?: string;
	forecastTomorrowMax?: string;
	forecastTomorrowMin?: string;
	forecastTomorrowIcon?: string;
	forecastDay3Max?: string;
	forecastDay3Min?: string;
	forecastDay3Icon?: string;
	forecastDay4Max?: string;
	forecastDay4Min?: string;
	forecastDay4Icon?: string;
	width?: number;
	height?: number;
}

// ─── 7-segment SVG renderer ───────────────────────────────────────────────────
const SEGS: Record<string, string> = {
	a: "M 13.64 0 L 43.64 0 L 37.92 6 L 17.92 6 Z",
	f: "M 8.04 5 L 13.44 10 L 10.8 32 L 4.44 35 Z",
	b: "M 48.04 5 L 44.44 35 L 38.8 32 L 41.44 10 Z",
	g: "M 10.32 36 L 14.68 33 L 34.68 33 L 38.32 36 L 33.96 39 L 13.96 39 Z",
	e: "M 4.2 37 L 9.84 40 L 7.2 62 L 0.6 67 Z",
	c: "M 44.2 37 L 40.6 67 L 35.2 62 L 37.84 40 Z",
	d: "M 5 72 L 35 72 L 30.72 66 L 10.72 66 Z",
};
const CHARS: Record<string, string[]> = {
	"0": ["a", "b", "c", "d", "e", "f"],
	"1": ["b", "c"],
	"2": ["a", "b", "g", "e", "d"],
	"3": ["a", "b", "g", "c", "d"],
	"4": ["f", "g", "b", "c"],
	"5": ["a", "f", "g", "c", "d"],
	"6": ["a", "f", "g", "e", "d", "c"],
	"7": ["a", "b", "c"],
	"8": ["a", "b", "c", "d", "e", "f", "g"],
	"9": ["a", "b", "c", "d", "f", "g"],
	"-": ["g"],
	" ": [],
};

function SevenSegment({
	value,
	size = 72,
	color = "#000",
}: {
	value: string;
	size?: number;
	color?: string;
}) {
	const DW = 54;
	const DOT = 14;
	const COL = 22;
	const G = 4;
	const chars = Array.from(value);
	let totalW = 0;
	for (const ch of chars)
		totalW += (ch === "." ? DOT : ch === ":" ? COL : DW) + G;
	totalW = Math.max(totalW - G, 1);
	let x = 0;
	return (
		<svg
			width={totalW * (size / 72)}
			height={size}
			viewBox={`0 0 ${totalW} 72`}
			style={{ display: "inline-block" }}
		>
			<title>seg</title>
			{chars.map((ch, i) => {
				const cx = x;
				if (ch === ".") {
					x += DOT + G;
					return (
						<g key={i} transform={`translate(${cx},0)`}>
							<path d="M 2 66 L 12 66 L 12 72 L 2 72 Z" fill={color} />
						</g>
					);
				}
				if (ch === ":") {
					x += COL + G;
					return (
						<g key={i} transform={`translate(${cx},0)`}>
							<path d="M 7 16 L 13 16 L 13 23 L 7 23 Z" fill={color} />
							<path d="M 5 49 L 11 49 L 11 56 L 5 56 Z" fill={color} />
						</g>
					);
				}
				x += DW + G;
				const on = CHARS[ch] ?? [];
				return (
					<g key={i} transform={`translate(${cx},0)`}>
						{Object.entries(SEGS).map(([s, p]) => (
							<path
								key={s}
								d={p}
								fill={color}
								opacity={on.includes(s) ? 1 : 0.04}
							/>
						))}
					</g>
				);
			})}
		</svg>
	);
}

// ─── 1-bit SVG weather icons ──────────────────────────────────────────────────
function WeatherIcon({
	type,
	size = 96,
	filled = false,
}: {
	type: string;
	size?: number;
	filled?: boolean;
}) {
	const sw = 3.5;
	const c = "#000";
	const Cloud = ({ fill }: { fill?: string }) => (
		<path
			d="M14 50C8 50 4 46 4 40C4 35 8 31 13 30C15 23 21 18 29 18C37 18 43 23 45 30C51 31 56 35 56 41C56 46 51 50 45 50Z"
			fill={fill ?? (filled ? c : "#FFF")}
			stroke={c}
			strokeWidth={sw}
			strokeLinejoin="round"
		/>
	);
	const SunCircle = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => {
		const rays = [];
		for (let a = 0; a < 360; a += 45) {
			const rad = (a * Math.PI) / 180;
			rays.push(
				<line
					key={a}
					x1={cx + Math.cos(rad) * (r + 2)}
					y1={cy + Math.sin(rad) * (r + 2)}
					x2={cx + Math.cos(rad) * (r + 8)}
					y2={cy + Math.sin(rad) * (r + 8)}
					stroke={c}
					strokeWidth={sw}
					strokeLinecap="round"
				/>,
			);
		}
		return (
			<g>
				{rays}
				<circle cx={cx} cy={cy} r={r} fill="#FFF" stroke={c} strokeWidth={sw} />
			</g>
		);
	};
	// Satori/Takumi: React Fragments (<>...</>) break inside SVG — always use <g> wrapper.
	// Also, <line> has inconsistent support; use <path> M/L syntax instead.
	const Drops = () => (
		<g>
			<path
				d="M18 54 L16 60"
				stroke={c}
				strokeWidth={sw}
				strokeLinecap="round"
			/>
			<path
				d="M29 56 L27 62"
				stroke={c}
				strokeWidth={sw}
				strokeLinecap="round"
			/>
			<path
				d="M40 54 L38 60"
				stroke={c}
				strokeWidth={sw}
				strokeLinecap="round"
			/>
		</g>
	);

	let content: React.ReactNode;
	if (type === "sun") content = <SunCircle cx={30} cy={30} r={10} />;
	else if (type === "sun-cloud")
		content = (
			<g>
				<SunCircle cx={20} cy={18} r={8} />
				<Cloud />
			</g>
		);
	else if (type === "rain")
		content = (
			<g>
				<Cloud />
				<Drops />
			</g>
		);
	else if (type === "snow")
		content = (
			<g>
				<Cloud />
				{[18, 30, 42].map((x) => (
					<text key={x} x={x} y={62} fontSize={9} textAnchor="middle" fill={c}>
						*
					</text>
				))}
			</g>
		);
	else if (type === "thunder")
		content = (
			<g>
				<Cloud />
				<path d="M33 50 L26 57 L31 57 L28 63 L38 55 L33 55Z" fill={c} />
			</g>
		);
	else content = <Cloud />;

	return (
		<svg
			viewBox="0 0 64 64"
			width={size}
			height={size}
			style={{ display: "block" }}
		>
			<title>wx</title>
			{content}
		</svg>
	);
}

// ─── Main component ───────────────────────────────────────────────────────────
function StarMeteo({
	currentMax = "23",
	currentMin = "12",
	currentIcon = "sun-cloud",
	time = "12:34",
	probeTemp = "17.3",
	forecastTomorrowMax = "20",
	forecastTomorrowMin = "10",
	forecastTomorrowIcon = "sun-cloud",
	forecastDay3Max = "17",
	forecastDay3Min = "8",
	forecastDay3Icon = "cloud",
	forecastDay4Max = "19",
	forecastDay4Min = "10",
	forecastDay4Icon = "rain",
	width = DEFAULT_IMAGE_WIDTH,
	height = DEFAULT_IMAGE_HEIGHT,
}: StarMeteoProps) {
	const hour = Number.parseInt(time.split(":")[0], 10) || 12;
	const period =
		hour >= 6 && hour < 12
			? "MATIN"
			: hour >= 12 && hour < 18
				? "APRES-MIDI"
				: hour >= 18 && hour < 22
					? "SOIR"
					: "NUIT";

	// Layout constants
	const PAD = 20;
	const W = width - PAD * 2; // 760
	const GAP = 8;
	const TOP_H = 174;
	const MID_H = 98;
	const BOT_H = height - PAD * 2 - TOP_H - MID_H - GAP * 2; // ~152

	// ── Forecast section (inside unified panel) ───────────────────────────────
	// IMPORTANT: ForecastSection is a functional sub-component — PreSatori's transform()
	// does NOT reach inside it. ALL layout properties MUST be inline `style`.
	const TEMP_SEG_SIZE = 48; // 7-segment size for forecast card temperatures
	const TEMP_LABEL_SIZE = 12; // px for "Ht" / "Bs" labels
	const iconH = Math.max(BOT_H - 22 - 12 - TEMP_SEG_SIZE - 16, 48); // available icon height
	const PANEL_BORDER_W = 4;
	const DIVIDER_W = 4;
	const sectionW = Math.floor((W - PANEL_BORDER_W * 2 - DIVIDER_W * 2) / 3);
	const innerPad = 10;

	const ForecastSection = ({
		day,
		iconType,
		maxT,
		minT,
	}: {
		day: string;
		iconType: string;
		maxT: string;
		minT: string;
	}) => (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				width: sectionW,
				height: BOT_H,
				paddingTop: innerPad,
				paddingBottom: innerPad,
				paddingLeft: innerPad,
				paddingRight: innerPad,
				boxSizing: "border-box",
			}}
		>
			{/* Day label — bigger & bolder, like image 2 */}
			<span
				style={{
					fontSize: 16,
					fontWeight: "900",
					textTransform: "uppercase",
					letterSpacing: 1.5,
					lineHeight: 1,
					flexShrink: 0,
				}}
			>
				{day}
			</span>

			{/* Icon — flex: 1 fills remaining vertical space */}
			<div
				style={{
					display: "flex",
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					width: sectionW - innerPad * 2,
				}}
			>
				<WeatherIcon type={iconType} size={iconH} filled />
			</div>

			{/* Ht [7seg] Bs [7seg] — single bottom row with larger digits */}
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "flex-end",
					justifyContent: "center",
					gap: 6,
					flexShrink: 0,
				}}
			>
				{/* Ht group */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "flex-end",
						gap: 2,
					}}
				>
					<span
						style={{
							fontSize: TEMP_LABEL_SIZE,
							fontWeight: "900",
							opacity: 0.6,
							marginBottom: 4,
						}}
					>
						Ht
					</span>
					<SevenSegment value={maxT} size={TEMP_SEG_SIZE} />
					<span
						style={{
							fontSize: 16,
							fontWeight: "bold",
							marginBottom: 4,
						}}
					>
						°
					</span>
				</div>
				{/* Bs group */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "flex-end",
						gap: 2,
					}}
				>
					<span
						style={{
							fontSize: TEMP_LABEL_SIZE,
							fontWeight: "900",
							opacity: 0.6,
							marginBottom: 4,
						}}
					>
						Bs
					</span>
					<SevenSegment value={minT} size={TEMP_SEG_SIZE} />
					<span
						style={{
							fontSize: 16,
							fontWeight: "bold",
							marginBottom: 4,
						}}
					>
						°
					</span>
				</div>
			</div>
		</div>
	);

	return (
		<PreSatori width={width} height={height}>
			{/*
			  className="flex flex-col w-full h-full" is REQUIRED — Takumi uses the tw
			  prop (from className) for canvas-level sizing. Inline style width/height
			  alone don't work. Follows same pattern as weather.tsx.
			*/}
			<div
				className="flex flex-col w-full h-full bg-white text-black"
				style={{ padding: PAD, gap: GAP }}
			>
				{/* ── ROW 1: Today bordered box ──────────────────────────────────────── */}
				<div
					className="flex flex-row items-center justify-between relative"
					style={{
						height: TOP_H,
						width: W,
						// Borders in inline style — className border-* not rendered by Takumi
						borderWidth: 4,
						borderStyle: "solid",
						borderColor: "#000000",
						borderRadius: 28,
						paddingLeft: 14,
						paddingRight: 14,
						flexShrink: 0,
						boxSizing: "border-box",
					}}
				>
					{/* Period badge on top border — inline style for position + colors */}
					<div
						className="absolute"
						style={{
							top: -16,
							left: Math.floor(W / 2) - 92,
							width: 184,
							backgroundColor: "#000000",
							color: "#ffffff",
							fontSize: 13,
							fontWeight: "900",
							letterSpacing: 2,
							textAlign: "center",
							paddingTop: 3,
							paddingBottom: 3,
							borderRadius: 4,
						}}
					>
						{period}
					</div>

					{/* Ht max temperature */}
					<div className="flex flex-row items-center" style={{ gap: 4 }}>
						<span
							style={{
								fontSize: 16,
								fontWeight: "900",
								alignSelf: "flex-start",
								marginTop: 10,
							}}
						>
							Ht
						</span>
						<SevenSegment value={currentMax} size={110} />
						<span
							style={{
								fontSize: 36,
								fontWeight: "bold",
								alignSelf: "flex-start",
								marginTop: 2,
							}}
						>
							°
						</span>
					</div>

					{/* Central weather icon */}
					<div className="flex items-center justify-center" style={{ flex: 1 }}>
						<WeatherIcon type={currentIcon} size={130} filled={false} />
					</div>

					{/* Bs min temperature */}
					<div className="flex flex-row items-center" style={{ gap: 4 }}>
						<span
							style={{
								fontSize: 16,
								fontWeight: "900",
								alignSelf: "flex-start",
								marginTop: 10,
							}}
						>
							Bs
						</span>
						<SevenSegment value={currentMin} size={110} />
						<span
							style={{
								fontSize: 36,
								fontWeight: "bold",
								alignSelf: "flex-start",
								marginTop: 2,
							}}
						>
							°
						</span>
						{/* RF signal icon */}
						<div style={{ position: "absolute", bottom: 8, right: 10 }}>
							<svg
								viewBox="0 0 24 24"
								width={26}
								height={26}
								fill="none"
								stroke="#000"
								strokeWidth="2.5"
								strokeLinecap="round"
								style={{ display: "block" }}
							>
								<title>RF</title>
								<circle cx="6" cy="18" r="1.5" fill="#000" stroke="none" />
								<path d="M10 18a4 4 0 0 0-4-4" />
								<path d="M14 18a8 8 0 0 0-8-8" />
								<path d="M18 18a12 12 0 0 0-12-12" />
							</svg>
						</div>
					</div>
				</div>

				{/* ── ROW 2: Clock + Probe temperature ─────────────────────────────── */}
				<div
					className="flex flex-row items-center justify-between"
					style={{
						height: MID_H,
						width: W,
						paddingLeft: 8,
						paddingRight: 8,
						flexShrink: 0,
					}}
				>
					<div className="flex items-center">
						<SevenSegment value={time} size={96} />
					</div>
					<div className="flex flex-row items-center" style={{ gap: 4 }}>
						<SevenSegment value={probeTemp} size={96} />
						<span
							style={{
								fontSize: 34,
								fontWeight: "bold",
								alignSelf: "flex-start",
								marginTop: 2,
							}}
						>
							°
						</span>
						<div
							className="flex flex-col items-center"
							style={{ marginTop: 20 }}
						>
							<span
								style={{ fontSize: 10, fontWeight: "900", letterSpacing: 0.5 }}
							>
								EXT
							</span>
							<div
								style={{
									backgroundColor: "#000000",
									borderRadius: 2,
									marginTop: 2,
									paddingLeft: 3,
									paddingRight: 3,
									paddingTop: 2,
									paddingBottom: 2,
								}}
							>
								<span
									style={{ color: "#ffffff", fontSize: 8, fontWeight: "900" }}
								>
									PROBE
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* ── ROW 3: Unified forecast panel with vertical dividers ──────────── */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						width: W,
						height: BOT_H,
						borderWidth: 4,
						borderStyle: "solid",
						borderColor: "#000000",
						borderRadius: 24,
						overflow: "hidden",
						flexShrink: 0,
						boxSizing: "border-box",
						backgroundColor: "#ffffff",
					}}
				>
					<ForecastSection
						day="DEMAIN"
						iconType={forecastTomorrowIcon}
						maxT={forecastTomorrowMax}
						minT={forecastTomorrowMin}
					/>
					{/* Vertical divider */}
					<div
						style={{ width: 4, backgroundColor: "#000000", flexShrink: 0 }}
					/>
					<ForecastSection
						day="JOUR 3"
						iconType={forecastDay3Icon}
						maxT={forecastDay3Max}
						minT={forecastDay3Min}
					/>
					{/* Vertical divider */}
					<div
						style={{ width: 4, backgroundColor: "#000000", flexShrink: 0 }}
					/>
					<ForecastSection
						day="JOUR 4"
						iconType={forecastDay4Icon}
						maxT={forecastDay4Max}
						minT={forecastDay4Min}
					/>
				</div>
			</div>
		</PreSatori>
	);
}

export const definition: RecipeDefinition<
	typeof paramsSchema,
	typeof dataSchema
> = {
	meta: {
		slug: "starmeteo",
		title: "StarMeteo Weather Station",
		description:
			"A weather station inspired by the La Crosse Technology StarMeteo e-ink displays, rendering segmented text and 1-bit icons.",
		published: true,
		tags: ["tailwind", "weather", "retro", "live-data", "configurable"],
		author: { name: "Antigravity", github: "" },
		category: "display-components",
		version: "0.1.0",
		createdAt: "2026-06-15T00:00:00Z",
		updatedAt: "2026-06-15T00:00:00Z",
	},
	paramsSchema,
	dataSchema,
	getData: async (params) => {
		const data = await getStarMeteoDataInternal(params);
		return data as z.infer<typeof dataSchema>;
	},
	Component: ({ width, height, data }) => (
		<StarMeteo {...data} width={width} height={height} />
	),
};
