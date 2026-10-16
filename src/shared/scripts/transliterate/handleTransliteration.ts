import { MAX_INPUT_LENGTH } from "../../configs/transliteration.ts";
import { transliterate } from "./transliterate.ts";
import { transliterateFromArm } from "./transliterateFromArm.ts";
import { clipText } from "./utils.ts";

export type TScript = "latin" | "armenian";
export type TTranslitSuccess = {
	ok: true;
	direction: "lat-arm" | "arm-lat";
	text: string;
	truncated?: true;
};
export type TTranslitFailure = { ok: false; reason: "no-supported-script" };
export type TTranslitResult = TTranslitSuccess | TTranslitFailure;

// a letter (\p{L}) that is also Latin or Armenian – skips digits, punctuation (incl. Armenian one) and other scripts
const FIRST_SUPPORTED_LETTER =
	/(?=\p{L})[\p{Script=Latin}\p{Script=Armenian}]/u;
const ARMENIAN_SCRIPT = /\p{Script=Armenian}/u;

export function detectScript(text: string): TScript | null {
	const firstLetter = text.match(FIRST_SUPPORTED_LETTER)?.[0];
	if (!firstLetter) return null;
	return ARMENIAN_SCRIPT.test(firstLetter) ? "armenian" : "latin";
}

export function handleTransliteration(text: string): TTranslitResult {
	const trimmed = text.trim();
	const clipped = clipText(trimmed, MAX_INPUT_LENGTH);
	const truncated = clipped !== trimmed;

	const script = detectScript(clipped);
	if (script === "latin") {
		return {
			ok: true,
			direction: "lat-arm",
			text: transliterate(clipped),
			...(truncated && { truncated: true }),
		};
	}
	if (script === "armenian") {
		return {
			ok: true,
			direction: "arm-lat",
			text: transliterateFromArm(clipped),
			...(truncated && { truncated: true }),
		};
	}
	return { ok: false, reason: "no-supported-script" };
}
