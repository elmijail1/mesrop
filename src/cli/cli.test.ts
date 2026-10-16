import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { MAX_INPUT_LENGTH } from "../shared/configs/transliteration.ts";
import { transliterate } from "../shared/scripts/transliterate/transliterate.ts";
import { clipText } from "../shared/scripts/transliterate/utils.ts";
import {
	ERROR_MESSAGE_UNKNOWN_SCRIPT,
	WARNING_MESSAGE_TRUNCATED,
} from "./messages.ts";

const CLI_PATH = fileURLToPath(new URL("./index.ts", import.meta.url));

function runCli(args: string[], input?: string) {
	const { stdout, stderr, status } = spawnSync(
		process.execPath,
		[CLI_PATH, ...args],
		{ encoding: "utf8", input },
	);
	return { stdout, stderr, status };
}

describe("CLI", () => {
	it("transliterates a normal Latin input", () => {
		expect(runCli(["barev dzez"])).toEqual({
			stdout: "բարև ձեզ\n",
			stderr: "",
			status: 0,
		});
	});

	it("transliterates a normal Armenian input", () => {
		expect(runCli(["Բարև"])).toEqual({
			stdout: "Barev\n",
			stderr: "",
			status: 0,
		});
	});

	it("shows the help for an empty input", () => {
		const { stdout, stderr, status } = runCli([""]);
		expect(stdout).toContain("Usage: mesrop");
		expect(stderr).toBe("");
		expect(status).toBe(0);
	});

	it.each(["   ", "123"])(
		"fails with an error for an input without supported letters: %j",
		(input) => {
			expect(runCli([input])).toEqual({
				stdout: "",
				stderr: `${ERROR_MESSAGE_UNKNOWN_SCRIPT}\n`,
				status: 1,
			});
		},
	);

	it("transliterates only the clipped part of an excessive input and warns about it", () => {
		const input = "a".repeat(MAX_INPUT_LENGTH * 2);
		expect(runCli([input])).toEqual({
			stdout: `${transliterate(clipText(input, MAX_INPUT_LENGTH))}…\n`,
			stderr: `${WARNING_MESSAGE_TRUNCATED}\n`,
			status: 0,
		});
	});

	it("keeps the interactive session running after an error until /q", () => {
		const { stdout, stderr, status } = runCli(
			["-i"],
			"barev dzez\n123\nԲարև\n/q\n",
		);
		expect(stdout).toContain("բարև ձեզ");
		expect(stdout).toContain("Barev");
		expect(stderr).toBe(`${ERROR_MESSAGE_UNKNOWN_SCRIPT}\n`); // how does this error persist?
		expect(status).toBe(0);
	});
});
