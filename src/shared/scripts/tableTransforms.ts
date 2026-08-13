import type { TTranslitNode, TTranslitTable } from "../data/tables.ts";

type TCombinedValue = string | { regular: string; init: string };
export type TFlattenedMap = Record<string, TCombinedValue>;

function flattenTable(
	node: TTranslitNode,
	accumulator: Record<string, string> = {},
): Record<string, string> {
	if (typeof node === "string") {
		return accumulator;
	}
	for (const [key, value] of Object.entries(node)) {
		if (typeof value === "string") {
			accumulator[key] = value;
		} else {
			flattenTable(value, accumulator);
		}
	}
	return accumulator;
}

// YAGNI: this function could be more abstract (shape of items in tableCombined), but it currently has just 1 application
export function combineFlatTables(
	tableGen: TTranslitTable,
	tableInit: TTranslitTable,
): TFlattenedMap {
	const tableGenFlat = flattenTable(tableGen);
	const tableInitFlat = flattenTable(tableInit);
	const tableCombined: TFlattenedMap = { ...tableGenFlat };
	const specialInitKeys = Object.keys(tableInitFlat);
	for (let i = 0; i < specialInitKeys.length; i++) {
		const key = specialInitKeys[i];
		tableCombined[key] = {
			regular: tableGenFlat[key],
			init: tableInitFlat[key],
		};
	}
	const sortedEntries = Object.entries(tableCombined).sort(([a], [b]) =>
		a.localeCompare(b),
	);
	return Object.fromEntries(sortedEntries);
}

export function invertTable(
	array: [string, TTranslitNode][],
	objectAcc?: Record<string, string | string[]>,
): Record<string, string | string[]> {
	const finalObj: Record<string, string | string[]> = objectAcc
		? objectAcc
		: {};
	for (let i = 0; i < array.length; i++) {
		const entry = array[i];
		if (typeof entry[1] === "string") {
			const val = entry[1];
			if (!finalObj[val]) {
				finalObj[val] = entry[0];
			} else if (typeof finalObj[val] === "string") {
				finalObj[val] = [finalObj[val], entry[0]];
			} else {
				finalObj[val].push(entry[0]);
			}
		} else {
			invertTable(Object.entries(entry[1]), finalObj);
		}
	}
	return finalObj;
}
