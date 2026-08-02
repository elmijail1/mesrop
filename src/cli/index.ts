#!/usr/bin/env node
import { Command } from "commander";
import { transliterate } from "../shared/scripts/transliterate.ts";
import { combinedFlatTables } from "../shared/tables.ts";
import { printTable } from "./printTable.ts";

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
