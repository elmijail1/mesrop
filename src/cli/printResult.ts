import type { TTranslitSuccess } from "../shared/scripts/transliterate/handleTransliteration.ts";
import { WARNING_MESSAGE_TRUNCATED } from "./messages.ts";

export function printResult(result: TTranslitSuccess): void {
	if (result.truncated) {
		console.log(`${result.text}…`);
		console.warn(WARNING_MESSAGE_TRUNCATED);
		return;
	}
	console.log(result.text);
}
