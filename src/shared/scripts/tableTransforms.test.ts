import { describe, expect, it } from "vitest";
import {
	alphabetMap,
	specialInitChars,
	type TTranslitTable,
} from "../data/tables.ts";
import { alphabetMapArmenianFirst } from "../data/tablesComputed.ts";
import { invertTable } from "./tableTransforms.ts";

function collectPairs(table: TTranslitTable): [string, string][] {
	return Object.entries(table).flatMap(([key, node]) =>
		typeof node === "string"
			? [[key, node] as [string, string]]
			: collectPairs(node),
	);
}

function toArray(value: string | string[]): string[] {
	return typeof value === "string" ? [value] : value;
}

describe("invertTable", () => {
	it("inverts flat entries", () => {
		expect(invertTable(Object.entries({ a: "ա", b: "բ" }))).toEqual({
			ա: "a",
			բ: "b",
		});
	});

	it("flattens nested entries without leaking group keys", () => {
		const table: TTranslitTable = { c: { c: "ծ", ch: { ch: "ճ" } } };
		expect(invertTable(Object.entries(table))).toEqual({ ծ: "c", ճ: "ch" });
	});

	it("merges duplicate values into one key with an array in table order", () => {
		const table: TTranslitTable = {
			k: { "k'": "ք" },
			q: "ք",
			x: "ս",
			s: "ս",
			z: "ս",
		};
		expect(invertTable(Object.entries(table))).toEqual({
			ք: ["k'", "q"],
			ս: ["x", "s", "z"],
		});
	});

	it.each([
		{ name: "alphabetMap", table: alphabetMap },
		{ name: "specialInitChars", table: specialInitChars },
	])(
		"covers every pair of $name exactly once with no empty values",
		({ table }) => {
			const inverted = invertTable(Object.entries(table));
			const pairs = collectPairs(table);

			for (const [lat, arm] of pairs) {
				expect(inverted).toHaveProperty([arm]);
				expect(toArray(inverted[arm])).toContain(lat);
			}

			const values = Object.values(inverted);
			for (const value of values) {
				expect(value.length).toBeGreaterThan(0);
			}
			expect(values.flatMap(toArray)).toHaveLength(pairs.length);
		},
	);
});

describe("alphabetMapArmenianFirst", () => {
	it("has a key for every Armenian letter of both source tables", () => {
		const letters = [
			...collectPairs(alphabetMap),
			...collectPairs(specialInitChars),
		].map(([, arm]) => arm);
		expect(Object.keys(alphabetMapArmenianFirst)).toEqual(
			expect.arrayContaining([...new Set(letters)]),
		);
	});
});
