#!/usr/bin/env node
import { Command } from "commander";
import { transliterate } from "./transliterate.ts";

const cli = new Command()
	.name("mesrop")
	.description("Transliterate from the Latin script to Armenian")
	.argument("<word>", "...")
	.action((word) => console.log(transliterate(word)));

cli.parse();
