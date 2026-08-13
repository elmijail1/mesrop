import {
	alphabetMap,
	specialInitChars,
	type TTranslitNode,
	type TTranslitTable,
} from "../../data/tables.ts";
import { isInitChar } from "./utils.ts";

const SPECIAL_INIT_CHAR_KEYS = Object.keys(specialInitChars);

export function transliterate(sub: string): string {
	const finalArr: string[] = [];
	const trimmedSub = sub.trim();

	for (let i = 0; i < trimmedSub.length; i++) {
		const char = trimmedSub[i];
		const charLow = char.toLowerCase();
		const isUpper = char !== charLow;

		if (!alphabetMap[charLow]) {
			finalArr.push(char);
			continue;
		}

		if (isInitChar(trimmedSub, i) && SPECIAL_INIT_CHAR_KEYS.includes(charLow)) {
			const resEntry = matchAndPushArmChar(
				specialInitChars,
				charLow,
				trimmedSub,
				i,
				finalArr,
				isUpper,
			);
			i = i + resEntry.length - 1;
			continue;
		}
		const resEntry = matchAndPushArmChar(
			alphabetMap,
			charLow,
			trimmedSub,
			i,
			finalArr,
			isUpper,
		);
		i = i + resEntry.length - 1;
	}

	return finalArr.join("");
}

function matchAndPushArmChar(
	map: TTranslitTable,
	char: string,
	sub: string,
	ind: number,
	finalArr: string[],
	isUpper: boolean,
): { value: string; length: number } {
	const entry = map[char];
	const resEntry = resolveEntry(entry, char, sub, ind, isUpper);
	if (!resEntry) {
		throw new Error("Match not found");
	}
	finalArr.push(isUpper ? resEntry.value.toUpperCase() : resEntry.value);
	return resEntry;
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
