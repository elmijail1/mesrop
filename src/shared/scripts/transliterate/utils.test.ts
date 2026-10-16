import { describe, expect, it } from "vitest";
import { clipText } from "./utils.ts";

describe("clipText", () => {
	it("keeps a text shorter than the limit intact", () => {
		expect(clipText("barev", 10)).toBe("barev");
	});

	it("keeps a text exactly at the limit intact", () => {
		expect(clipText("barev", 5)).toBe("barev");
	});

	it("keeps only the first characters of a text longer than the limit", () => {
		expect(clipText("barev dzez", 5)).toBe("barev");
		expect(clipText("բարև ձեզ", 4)).toBe("բարև");
	});

	it("doesn't split characters made of several code units", () => {
		expect(clipText("😀😀😀", 2)).toBe("😀😀");
	});
});
