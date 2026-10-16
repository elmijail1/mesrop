#!/usr/bin/env node
import { Command } from "commander";
import { MAX_INPUT_LENGTH } from "../shared/configs/transliteration.ts";
import { combinedFlatTables } from "../shared/data/tablesComputed.ts";
import { handleTransliteration } from "../shared/scripts/transliterate/handleTransliteration.ts";
import { ERROR_MESSAGE_UNKNOWN_SCRIPT } from "./messages.ts";
import { printResult } from "./printResult.ts";
import { printTable } from "./printTable.ts";
import { runInteractive } from "./runInteractive.ts";

const cli = new Command()
	.name("mesrop")
	.description(
		"transliterate between Latin and Armenian – the direction is detected automatically",
	)
	.argument(
		"[text]",
		`Latin or Armenian text (up to ${MAX_INPUT_LENGTH} characters, the rest is cut off)`,
	)
	.option("-t, --table", "show the transliteration table")
	.option("-i, --interactive", "start an interactive transliteration session")
	.addHelpText(
		"after",
		[
			"",
			"Examples:",
			'  $ mesrop "barev dzez"    # → բարև ձեզ',
			'  $ mesrop "բարև ձեզ"      # → barev dzez',
			"  $ mesrop -i",
		].join("\n"),
	)
	.action((text, options) => {
		if (options.interactive) {
			runInteractive();
			return;
		}
		if (options.table) {
			printTable(combinedFlatTables);
			return;
		}
		if (!text) {
			cli.help();
			return;
		}
		const result = handleTransliteration(text);
		if (!result.ok) {
			console.error(ERROR_MESSAGE_UNKNOWN_SCRIPT);
			process.exitCode = 1;
			return;
		}
		printResult(result);
	});

cli.parse();
