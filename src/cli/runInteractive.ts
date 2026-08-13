import { createInterface } from "node:readline";
import { transliterate } from "../shared/scripts/transliterate/transliterate.ts";

export function runInteractive(): void {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: "> ",
	});

	console.log(
		"Interactive mode. Type text to transliterate. To quit type /q or /quit.",
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
		console.log(transliterate(trimmed));
		rl.prompt();
	});

	rl.on("SIGINT", () => rl.close());

	rl.on("close", () => {
		console.log("\nQuitting interactive transliteration.");
		process.exit(0);
	});
}
