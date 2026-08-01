import { describe, expect, it } from "vitest";
import { alphabetMap, specialInitChars, type TTranslitNode } from "./tables";
import { transliterate } from "./transliterate";

type TCase = { input: string; expected: string };
function flatten(node: TTranslitNode, prefix: string): TCase[] {
	if (typeof node === "string") {
		return [{ input: prefix, expected: node }];
	}
	return Object.entries(node).flatMap(([key, child]) => flatten(child, key));
}

describe("transliterate", () => {
	it("returns an empty string for empty input", () => {
		expect(transliterate("")).toBe("");
		expect(transliterate(" ")).toBe("");
		expect(transliterate("      ")).toBe("");
	});

	it("returns the correct transliterated version of a single word input", () => {
		expect(transliterate("Ararat")).toBe("Արարատ");
		expect(transliterate("ararat")).toBe("արարատ");
		expect(transliterate("AraRaT")).toBe("ԱրաՐաՏ");
	});

	it("returns the correct transliterated version of a multiple word input", () => {
		expect(transliterate("Barev dzez")).toBe("Բարև ձեզ");
		expect(transliterate("barev dzez")).toBe("բարև ձեզ");
		expect(transliterate("bareV DzeZ, lao")).toBe("բարև ՁեԶ, լաո");
	});

	it("keeps the upper case only for the first letter of a digraph and independent characters", () => {
		expect(transliterate("Yeghishe Ch'arents'")).toBe("Եղիշե Չարենց");
		expect(transliterate("yEghiShe cH'arenTs'")).toBe("եղիՇե չարենՑ");
	});

	it("handles special initial letters correctly", () => {
		expect(
			transliterate("Opop Ekek Ehsehk Vorvon Vervu Yuzyu Yerye Yevyev"),
		).toBe("Օպոպ Էկեկ Էհսէկ Որվոն Վերվու Յուզյու Երյե Եվյև");
		expect(
			transliterate("Opop Ekek Ehsehk Vorvon Vervu Yuzyu Yerye Yevyev"),
		).toBe("Օպոպ Էկեկ Էհսէկ Որվոն Վերվու Յուզյու Երյե Եվյև");
	});

	it("handles digraphs correctly", () => {
		expect(
			transliterate(
				"Ahbach Ac' Dodzev Errehgh Khoxk' Pip' Phushtheph Tsit'zahzh",
			),
		).toBe("Ըբաճ Աց Դոձև Էռէղ Խոխք Պիփ Փուշթեփ Ծիթզըժ");
		expect(transliterate("Vovo-vovo 'vovo'")).toBe("Ովո-ովո 'ովո'");
		expect(transliterate("Yeye (yevye—ye)")).toBe("Եյե (ևյե—ե)");
		expect(transliterate('Oz/oz "oz–oz" «oz')).toBe('Օզ/օզ "օզ–օզ" «օզ');
	});

	it("handles trigraphs correctly", () => {
		expect(transliterate("Ch'ach' Ts'ets'")).toBe("Չաչ Ցեց");
	});

	it("keeps characters absent in the dictionary intact", () => {
		expect(transliterate("Beboп_ Ятагаn!")).toBe("Բեբոп_ Ятагаն!");
	});

	it("handles divider characters properly", () => {
		expect(transliterate("Beboп_ Ятагаn!")).toBe("Բեբոп_ Ятагаն!");
	});
});

describe("tables", () => {
	describe("alphabetMap covers every table entry", () => {
		const cases = Object.entries(alphabetMap).flatMap(([key, node]) =>
			flatten(node, key).map(({ input, expected }) => ({
				input: `b${input}`,
				expected: `բ${expected}`,
			})),
		);

		it.each(cases)("transliterates $input", ({ input, expected }) => {
			expect(transliterate(input)).toBe(expected);
		});
	});

	describe("specialInitChars covers every table entry", () => {
		const cases = Object.entries(specialInitChars).flatMap(([key, node]) =>
			flatten(node, key),
		);
		it.each(cases)("transliterates initial $input", ({ input, expected }) =>
			expect(transliterate(input)).toBe(expected),
		);
	});
});
