import type { RefreshSchedule } from "@/lib/types";

export const DEFAULT_DEVICE_SCREEN = "simple-text";

export const DEVICE_SETUP_REFRESH_SECONDS = 60;
export const DISPLAY_FALLBACK_REFRESH_SECONDS = 180;
export const DEVICE_SLEEP_REFRESH_SECONDS = 3600;
export const UI_REFRESH_FALLBACK_SECONDS = 300;

export const DEFAULT_DEVICE_TIMEZONE = "UTC";
export const DEFAULT_DEVICE_SLEEP_START = "00:00";
export const DEFAULT_DEVICE_SLEEP_END = "07:00";

export function createDefaultRefreshSchedule(): RefreshSchedule {
	return {
		default_refresh_rate: DEVICE_SETUP_REFRESH_SECONDS,
		time_ranges: [
			{
				start_time: DEFAULT_DEVICE_SLEEP_START,
				end_time: DEFAULT_DEVICE_SLEEP_END,
				refresh_rate: DEVICE_SLEEP_REFRESH_SECONDS,
			},
		],
	};
}

export function serializeRefreshSchedule(schedule: RefreshSchedule): string {
	return JSON.stringify(schedule);
}

export function normalizeRefreshSchedule(
	value: unknown,
): RefreshSchedule | null {
	if (!value) return null;
	if (typeof value === "string") {
		try {
			return normalizeRefreshSchedule(JSON.parse(value));
		} catch {
			return null;
		}
	}
	if (typeof value !== "object" || Array.isArray(value)) return null;
	const candidate = value as Partial<RefreshSchedule>;
	const defaultRefreshRate = coerceRefreshRate(candidate.default_refresh_rate);
	if (defaultRefreshRate === null) return null;
	const timeRanges = Array.isArray(candidate.time_ranges)
		? candidate.time_ranges
				.map((range) => {
					if (typeof range !== "object" || range === null) return null;
					const refreshRate = coerceRefreshRate(range.refresh_rate);
					if (
						typeof range.start_time !== "string" ||
						typeof range.end_time !== "string" ||
						refreshRate === null
					) {
						return null;
					}
					return {
						start_time: range.start_time,
						end_time: range.end_time,
						refresh_rate: refreshRate,
					};
				})
				.filter(
					(range): range is RefreshSchedule["time_ranges"][number] =>
						range !== null,
				)
		: [];
	return {
		default_refresh_rate: defaultRefreshRate,
		time_ranges: timeRanges,
	};
}

// Historical bug: the device edit form once stored numeric fields as raw
// strings (e.g. "180") instead of numbers before saving refresh_schedule as
// JSON — coerce those back so existing rows don't silently lose their whole
// schedule.
function coerceRefreshRate(value: unknown): number | null {
	if (typeof value === "number") return Number.isFinite(value) ? value : null;
	if (typeof value === "string" && value.trim() !== "") {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
}
