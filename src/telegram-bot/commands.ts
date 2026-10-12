import type { BotCommand } from "grammy/types";

export const BOT_COMMANDS: BotCommand[] = [
	{
		command: "practice",
		description: "Learn to read and write Armenian letters",
	},
	{ command: "table", description: "See how Latin and Armenian letters match" },
	{ command: "help", description: "Show help" },
];
