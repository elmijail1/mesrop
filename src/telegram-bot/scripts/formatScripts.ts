import type { TFlattenedMap } from "../../shared/scripts/tables.ts";

export function formatTable(table: TFlattenedMap): string {
	const lines = Object.entries(table).map(([lat, arm]) => {
		let armFinal = arm;

		if (typeof arm !== "string") {
			if (arm.init && arm.regular && arm.init !== arm.regular) {
				armFinal = `${arm.regular} / ${arm.init} (init.)`;
			} else if (arm.init && arm.regular && arm.init === arm.regular) {
				armFinal = arm.regular;
			} else if (arm.init && !arm.regular) {
				armFinal = `${arm.init} (only init.)`;
			}
		}

		return `${lat.padEnd(6)} ${armFinal}`;
	});
	return `<b>How Latin & Armenian letters match</b>\n<pre>${lines.join("\n")}</pre>`;
}

export function formatHelp(): string {
	return [
		"<b>🇦🇲 Mesrop – Turn Latin text to Armenian</b>",
		"This bot turns your text in Latin letters to Armenian letters:",
		'- Type text in Latin letters: for example, "koko"',
		'- Get the same text in Armenian letters: "koko" → "կոկո"',
		"- You don't need any command to do that – just send your text as a regular message",
		"",
		"<b>ℹ️ Extra Commands</b>",
		"/practice – learn to read and write Armenian letters",
		"/table - view a table that shows how Latin and Armenian letters match",
		"/help – show help",
	].join("\n");
}
