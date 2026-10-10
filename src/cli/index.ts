#!/usr/bin/env node
import { Command } from "commander";
import { combinedFlatTables } from "../shared/data/tablesComputed.ts";
import { handleTransliteration } from "../shared/scripts/transliterate/handleTransliteration.ts";
import { ERROR_MESSAGE_UNKNOWN_SCRIPT } from "./messages.ts";
import { printResult } from "./printResult.ts";
import { printTable } from "./printTable.ts";
import { runInteractive } from "./runInteractive.ts";

const cli = new Command()
	.name("mesrop")
	.description("transliterate from the Latin script to Armenian")
	.argument("[text]", "text in Latin")
	.option("-t, --table", "show the transliteration table")
	.option("-i, --interactive", "start an interactive transliteration session")
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
