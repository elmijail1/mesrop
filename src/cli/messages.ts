import { MAX_INPUT_LENGTH } from "../shared/configs/transliteration.ts";

export const ERROR_MESSAGE_UNKNOWN_SCRIPT =
	"Try entering a text written with either Latin or Armenian characters.";
export const WARNING_MESSAGE_TRUNCATED = `WARNING: The result is truncated because only the first ${MAX_INPUT_LENGTH} characters get transliterated`;
