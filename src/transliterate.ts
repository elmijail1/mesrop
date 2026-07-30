import { alphabetMap, specialInitChars, type TTranslitNode } from "./tables.ts";

const SPECIAL_INIT_CHAR_KEYS = Object.keys(specialInitChars);
const DIVIDER_CHARS = ["-", " ", "/", "(", '"', "“", "«", "–", "—"];

export function transliterate(sub: string): string {
	const armSub: string[] = [];

	for (let i = 0; i < sub.length; i++) {
		const latCh = sub[i];
		const latChLow = latCh.toLowerCase();
		const isUpper = latCh !== latChLow;

		if (!alphabetMap[latChLow]) {
			armSub.push(latCh);
			continue;
		}

		if (isInitChar(sub, i) && SPECIAL_INIT_CHAR_KEYS.includes(latChLow)) {
			const entry = specialInitChars[latChLow];
			const resEntry = resolveEntry(entry, latChLow, sub, i);
			if (!resEntry) {
				throw new Error("Match not found");
			}
			armSub.push(isUpper ? resEntry.value.toUpperCase() : resEntry.value);
			i = i + resEntry.length - 1;
			continue;
		}

		const entry = alphabetMap[latChLow];
		const resEntry = resolveEntry(entry, latChLow, sub, i);
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
): { value: string; length: number } | null {
	if (typeof node === "string") {
		return { value: node, length: char.length };
	}

	// try to extend the match by one more char
	const nextChar = sub[ind + 1]?.toLowerCase();
	if (nextChar !== undefined) {
		const candidateKey = char + nextChar;
		const candidateNode = node[candidateKey];
		if (candidateNode !== undefined) {
			const deeper = resolveEntry(candidateNode, candidateKey, sub, ind + 1);
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
