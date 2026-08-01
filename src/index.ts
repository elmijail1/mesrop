#!/usr/bin/env node
import { Command } from "commander";
import { printTable } from "./scripts/tables.ts";
import { transliterate } from "./scripts/transliterate.ts";
import { combinedFlatTables } from "./tables.ts";

const cli = new Command()
	.name("mesrop")
	.description("Transliterate from the Latin script to Armenian")
	.argument("[word]", "Text to transliterate")
	.option("-t, --table", "Show the transliteration table")
	.action((word, options) => {
		if (options.table) {
			printTable(combinedFlatTables);
			return;
		}
		console.log(transliterate(word));
	});

cli.parse();
