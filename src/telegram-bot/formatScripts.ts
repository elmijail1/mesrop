import type { TFlattenedMap } from "../shared/scripts/flattenTable.ts";

export function formatTable(table: TFlattenedMap): string {
	const lines = Object.entries(table).map(([lat, arm]) => {
		const armenian =
			typeof arm === "string" ? arm : `${arm.regular} / ${arm.init} (init.)`;
		return `${lat.padEnd(6)} ${armenian}`;
	});
	return `<b>How Latin & Armenian letters match</b>\n<pre>${lines.join("\n")}</pre>`;
}

export function formatHelp(): string {
	return [
		"<b>Mesrop – Turn Latin text to Armenian</b>",
		"This is a transliterator that turns your text in Latin letters to Armenian letters",
		"",
		"<b>Commands</b>",
		"/table - view a table that shows how Latin and Armenian letters match",
		"/help – show help",
	].join("\n");
}
