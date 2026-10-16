import { createInterface } from "node:readline";
import { handleTransliteration } from "../shared/scripts/transliterate/handleTransliteration.ts";
import { ERROR_MESSAGE_UNKNOWN_SCRIPT } from "./messages.ts";
import { printResult } from "./printResult.ts";

export function runInteractive(): void {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: "> ",
	});

	console.log(
		"Interactive mode. Type Latin or Armenian text to transliterate. To quit type /q or /quit.",
	);
	rl.prompt();

	rl.on("line", (line) => {
		const trimmed = line.trim();
		if (trimmed === "/q" || trimmed === "/quit") {
			rl.close();
			return;
		}
		if (trimmed === "") {
			rl.prompt();
			return;
		}
		const result = handleTransliteration(trimmed);
		if (!result.ok) {
			console.error(ERROR_MESSAGE_UNKNOWN_SCRIPT);
		} else {
			printResult(result);
		}
		rl.prompt();
	});

	rl.on("SIGINT", () => rl.close());

	rl.on("close", () => {
		console.log("\nQuitting interactive transliteration.");
		process.exit(0);
	});
}
