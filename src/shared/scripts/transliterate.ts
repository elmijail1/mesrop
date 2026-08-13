import {
	alphabetMap,
	specialInitChars,
	type TTranslitNode,
} from "../data/tables.ts";
import {
	alphabetMapArmenianFirst,
	specialInitCharsArmenianFirst,
} from "../data/tablesComputed.ts";

const SPECIAL_INIT_CHAR_KEYS = Object.keys(specialInitChars);
const SPECIAL_INIT_CHAR_KEYS_ARM = Object.keys(specialInitCharsArmenianFirst);
const DIVIDER_CHARS = ["-", " ", "/", "(", '"', "“", "«", "–", "—"];

export function transliterate(sub: string): string {
	const armSub: string[] = [];

	const trimmedSub = sub.trim();

	for (let i = 0; i < trimmedSub.length; i++) {
		const latCh = trimmedSub[i];
		const latChLow = latCh.toLowerCase();
		const isUpper = latCh !== latChLow;

		if (!alphabetMap[latChLow]) {
			armSub.push(latCh);
			continue;
		}

		if (
			isInitChar(trimmedSub, i) &&
			SPECIAL_INIT_CHAR_KEYS.includes(latChLow)
		) {
			const entry = specialInitChars[latChLow];
			const resEntry = resolveEntry(entry, latChLow, trimmedSub, i, isUpper);
			if (!resEntry) {
				throw new Error("Match not found");
			}
			armSub.push(isUpper ? resEntry.value.toUpperCase() : resEntry.value);
			i = i + resEntry.length - 1;
			continue;
		}

		const entry = alphabetMap[latChLow];
		const resEntry = resolveEntry(entry, latChLow, trimmedSub, i, isUpper);
		if (!resEntry) {
			throw new Error("Match not found");
		}
		armSub.push(isUpper ? resEntry.value.toUpperCase() : resEntry.value);
		i = i + resEntry.length - 1;
	}

	return armSub.join("");
}

function resolveEntry(
	node: TTranslitNode,
	char: string,
	sub: string,
	ind: number,
	isUpper: boolean,
): { value: string; length: number } | null {
	if (typeof node === "string") {
		return { value: node, length: char.length };
	}

	// try to extend the match by one more char
	const nextChar = sub[ind + 1]?.toLowerCase();
	if (nextChar !== undefined) {
		const isSpecialCase = isUpper && char + nextChar === "yev";
		const candidateKey = isSpecialCase ? char : char + nextChar;
		const candidateNode = node[candidateKey];
		if (candidateNode !== undefined) {
			const deeper = resolveEntry(
				candidateNode,
				candidateKey,
				sub,
				ind + 1,
				isUpper,
			);
			if (deeper) return deeper;
		}
	}

	// further matching is impossible, fall back to the base entry at this level
	const base = node[char];
	return typeof base === "string" ? { value: base, length: char.length } : null;
}

function isInitChar(sub: string, ind: number): boolean {
	if (ind === 0) return true;
	if (
		DIVIDER_CHARS.includes(sub[ind - 1]) ||
		(sub[ind - 1] === "'" && DIVIDER_CHARS.includes(sub[ind - 2]))
	) {
		return true;
	}
	return false;
}

export function transliterateFromArmenian(sub: string): string {
	const latSub: string[] = [];
	const trimmedSub = sub.trim();

	for (let i = 0; i < trimmedSub.length; i++) {
		const armCh = trimmedSub[i];
		const armChLow = armCh.toLowerCase();
		const isUpper = armCh !== armChLow;

		if (!alphabetMapArmenianFirst[armChLow]) {
			latSub.push(armCh);
			continue;
		}

		// the notorious ու case (the only Armenian-first digraph requires special treatment)
		const charCombo = (trimmedSub[i] + trimmedSub[i + 1]).toLowerCase();
		if (charCombo === "ու") {
			matchAndPushLatChar(alphabetMapArmenianFirst, charCombo, latSub, isUpper);
			i++;
			continue;
		}

		if (
			isInitChar(trimmedSub, i) &&
			SPECIAL_INIT_CHAR_KEYS_ARM.includes(armChLow)
		) {
			matchAndPushLatChar(
				specialInitCharsArmenianFirst,
				armChLow,
				latSub,
				isUpper,
			);
			continue;
		}
		matchAndPushLatChar(alphabetMapArmenianFirst, armChLow, latSub, isUpper);
	}

	return latSub.join("");
}

function matchAndPushLatChar(
	map: Record<string, string | string[]>,
	currentChar: string,
	resultArray: string[],
	isUpper: boolean,
) {
	const entry = map[currentChar];
	const finalEntry = typeof entry === "string" ? entry : entry[0];
	resultArray.push(isUpper ? finalEntry.toUpperCase() : finalEntry);
}
