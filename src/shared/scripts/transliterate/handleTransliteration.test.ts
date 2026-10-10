import { describe, expect, it } from "vitest";
import { MAX_INPUT_LENGTH } from "../../configs/transliteration.ts";
import { handleTransliteration } from "./handleTransliteration.ts";
import { transliterate } from "./transliterate.ts";
import { transliterateFromArm } from "./transliterateFromArm.ts";
import { clipText } from "./utils.ts";

function expectArmLat(input: string) {
	expect(handleTransliteration(input)).toEqual({
		ok: true,
		direction: "arm-lat",
		text: transliterateFromArm(input),
	});
}

function expectLatArm(input: string) {
	expect(handleTransliteration(input)).toEqual({
		ok: true,
		direction: "lat-arm",
		text: transliterate(input),
	});
}

describe("handleTransliteration", () => {
	it("transliterates Armenian-only input Arm-Lat", () => {
		expectArmLat("Բարև ձեզ");
	});

	it("transliterates Latin-only input Lat-Arm", () => {
		expectLatArm("Barev dzez");
	});

	it.each(["...բարև", "123 բարև", "абв բարև", "აბგ բարև", "«՝Երևան»", "կոma"])(
		"picks Arm-Lat based on the first valid letter in %j",
		(input) => {
			expectArmLat(input);
		},
	);

	it.each(["...barev", "123 barev", "абв barev", "აბგ barev", "aկոma"])(
		"picks Lat-Arm based on the first valid letter in %j",
		(input) => {
			expectLatArm(input);
		},
	);

	it("transliterates only the clipped input when it exceeds the limit and marks it as truncated", () => {
		const input = "a".repeat(MAX_INPUT_LENGTH * 2);
		expect(handleTransliteration(input)).toEqual({
			ok: true,
			direction: "lat-arm",
			text: transliterate(clipText(input, MAX_INPUT_LENGTH)),
			truncated: true,
		});
	});

	it.each(["", "...!? 123", "абв где", "։՝"])(
		"returns a non-ok result for %j",
		(input) => {
			expect(handleTransliteration(input)).toEqual({
				ok: false,
				reason: "no-supported-script",
			});
		},
	);
});
