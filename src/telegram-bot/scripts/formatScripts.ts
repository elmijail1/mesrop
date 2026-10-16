import { MAX_INPUT_LENGTH } from "../../shared/configs/transliteration.ts";
import type { TFlattenedMap } from "../../shared/scripts/tableTransforms.ts";
import type { TTranslitSuccess } from "../../shared/scripts/transliterate/handleTransliteration.ts";
import { BOT_COMMANDS } from "../commands.ts";
import { WARNING_MESSAGE_TRUNCATED } from "../messages.ts";

export function formatTransliteration(result: TTranslitSuccess): string {
	if (result.truncated) {
		return `${result.text}…\n\n${WARNING_MESSAGE_TRUNCATED}`;
	}
	return result.text;
}

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
		"<b>🇦🇲 Mesrop – Turn Latin text to Armenian and back</b>",
		"This bot turns your text in Latin letters to Armenian letters and the other way round:",
		'- Send text in Latin letters: "koko" → "կոկո"',
		'- Send text in Armenian letters: "կոկո" → "koko"',
		"- You don't need any command to do that – just send your text as a regular message, the bot detects the direction by itself",
		`- Up to ${MAX_INPUT_LENGTH} characters per message`,
		"",
		"<b>ℹ️ Extra Commands</b>",
		...BOT_COMMANDS.map((c) => `- /${c.command} – ${c.description}`),
	].join("\n");
}
