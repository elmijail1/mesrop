import { describe, expect, it } from "vitest";
import { transliterateFromArm } from "./transliterateFromArm.ts";

describe("transliterateFromArm", () => {
	it("returns an empty string for empty input", () => {
		expect(transliterateFromArm("")).toBe("");
		expect(transliterateFromArm(" ")).toBe("");
		expect(transliterateFromArm("      ")).toBe("");
	});

	it("returns the correct transliterated version of a single word input", () => {
		expect(transliterateFromArm("Արարատ")).toBe("Ararat");
		expect(transliterateFromArm("արարատ")).toBe("ararat");
		expect(transliterateFromArm("ԱրաՐաՏ")).toBe("AraRaT");
	});

	it("returns the correct transliterated version of a multiple word input", () => {
		expect(transliterateFromArm("Բարև ձեզ")).toBe("Barev dzez");
		expect(transliterateFromArm("բարև ձեզ, լաո")).toBe("barev dzez, lao");
	});

	it("keeps the upper case only for the first letter of a multi-letter output", () => {
		expect(transliterateFromArm("Եղիշե Չարենց")).toBe("Yeghishe Ch'arenc'");
		expect(transliterateFromArm("եղիՇե չարենՑ")).toBe("yeghiShe ch'arenC'");
		expect(transliterateFromArm("Շուն Ճաշ Ժամ")).toBe("Shun Chash Zham");
		expect(transliterateFromArm("ՃՈՊ ՇՈՒՆ ՉԱՐԵՆՑ")).toBe("ChOP ShUN Ch'ARENC'");
	});

	it("handles special initial letters correctly", () => {
		expect(transliterateFromArm("Ոսկի Երևան Էջ Օձ Եվ")).toBe(
			"Voski Yerevan Ej Odz Yev",
		);
		expect(transliterateFromArm("ոսկի երևան էջ օձ և")).toBe(
			"voski yerevan ej odz yev",
		);
	});

	it("handles special initial letters in the middle of a word correctly", () => {
		expect(transliterateFromArm("կով բե ջէ աօդ բարև")).toBe(
			"kov be jeh aod barev",
		);
	});

	it("handles the ու digraph correctly", () => {
		expect(transliterateFromArm("ու Ու ՈՒ")).toBe("u U U");
		expect(transliterateFromArm("Ուր ՈՒՐ շուն")).toBe("Ur UR shun");
	});

	it("keeps characters absent in the dictionary intact", () => {
		expect(transliterateFromArm("Բեբոп_ Ятагаն!")).toBe("Beboп_ Ятагаn!");
	});

	it("handles divider characters properly", () => {
		expect(transliterateFromArm("բարև-երևան (ոսկի) «էջ»")).toBe(
			"barev-yerevan (voski) «ej»",
		);
	});
});
