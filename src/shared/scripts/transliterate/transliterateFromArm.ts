import {
	alphabetMapArmenianFirst,
	specialInitCharsArmenianFirst,
} from "../../data/tablesComputed.ts";
import { isInitChar } from "./utils.ts";

const SPECIAL_INIT_CHAR_KEYS_ARM = Object.keys(specialInitCharsArmenianFirst);

export function transliterateFromArm(sub: string): string {
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
): void {
	const entry = map[currentChar];
	const finalEntry = typeof entry === "string" ? entry : entry[0];
	resultArray.push(isUpper ? finalEntry.toUpperCase() : finalEntry);
}
