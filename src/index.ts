#!/usr/bin/env node
import { Command } from "commander";
import { printTable } from "./scripts/tables.ts";
import { transliterate } from "./scripts/transliterate.ts";
import { combinedFlatTables } from "./tables.ts";

const cli = new Command()
	.name("mesrop")
	.description("transliterate from the Latin script to Armenian")
	.argument("[text]", "text in Latin")
	.option("-t, --table", "show the transliteration table")
	.action((text, options) => {
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
