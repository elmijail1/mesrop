import type { TFlattenedMap } from "../shared/scripts/flattenTable.ts";

export function formatTable(table: TFlattenedMap): string {
	const lines = Object.entries(table).map(([lat, arm]) => {
		const armenian =
			typeof arm === "string" ? arm : `${arm.regular} / ${arm.init} (init.)`;
		return `${lat.padEnd(6)} ${armenian}`;
	});
	return `<b>How Latin & Armenian letters match</b>\n<pre>${lines.join("\n")}</pre>`;
}
