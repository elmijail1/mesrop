import { MAX_INPUT_LENGTH } from "../shared/configs/transliteration.ts";

export const ERROR_MESSAGE_UNKNOWN_SCRIPT = [
	"😱 This isn't written in Latin or Armenian characters!",
	'Try sending something like "Barev" or "Բարև".',
].join("\n");

export const WARNING_MESSAGE_TRUNCATED = [
	`⚠️ Only the first ${MAX_INPUT_LENGTH} characters have been transliterated!`,
	"Try dividing your message into shorter ones.",
].join("\n");
