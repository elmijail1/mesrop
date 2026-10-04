import { transliterate } from "./transliterate.ts";
import { transliterateFromArm } from "./transliterateFromArm.ts";

export type TScript = "latin" | "armenian";
export type TTranslitResult =
	| { ok: true; direction: "lat-arm" | "arm-lat"; text: string }
	| { ok: false; reason: "no-supported-script" };

// a letter (\p{L}) that is also Latin or Armenian – skips digits, punctuation (incl. Armenian one) and other scripts
const FIRST_SUPPORTED_LETTER = /(?=\p{L})[\p{Script=Latin}\p{Script=Armenian}]/u;
const ARMENIAN_SCRIPT = /\p{Script=Armenian}/u;

export function detectScript(text: string): TScript | null {
	const firstLetter = text.match(FIRST_SUPPORTED_LETTER)?.[0];
	if (!firstLetter) return null;
	return ARMENIAN_SCRIPT.test(firstLetter) ? "armenian" : "latin";
}

export function handleTransliteration(text: string): TTranslitResult {
	const script = detectScript(text);
	if (script === "latin") {
		return { ok: true, direction: "lat-arm", text: transliterate(text) };
	}
	if (script === "armenian") {
		return { ok: true, direction: "arm-lat", text: transliterateFromArm(text) };
	}
	return { ok: false, reason: "no-supported-script" };
}
