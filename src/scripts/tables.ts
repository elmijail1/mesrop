import type { TTranslitNode, TTranslitTable } from "../tables.ts";

type TCombinedValue = string | { regular: string; init: string };
type TFlattenedMap = Record<string, TCombinedValue>;

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

export function printTable(flatTable: TFlattenedMap): void {
	const entries = Object.entries(flatTable);
	console.table(
		entries.map(([lat, arm]) => {
			if (typeof arm === "string") return { Latin: lat, Armenian: arm };
			if (arm.regular && arm.regular !== arm.init)
				return { Latin: lat, Armenian: `${arm.regular} / ${arm.init} (init.)` };
			if (!arm.regular && arm.init)
				return { Latin: `${lat} (init. only)`, Armenian: arm.init };
			return { Latin: lat, Armenian: arm.regular };
		}),
	);
}
