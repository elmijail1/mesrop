#!/usr/bin/env node
import { Command } from "commander";
import { combinedFlatTables } from "../shared/data/tablesComputed.ts";
import { transliterate } from "../shared/scripts/transliterate/transliterate.ts";
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
		console.log(transliterate(text));
	});

cli.parse();
