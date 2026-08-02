import { Bot } from "grammy";
import { transliterate } from "../shared/scripts/transliterate.ts";
import { combinedFlatTables } from "../shared/tables.ts";
import { formatHelp, formatTable } from "./formatScripts.ts";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
	throw new Error("Token invalid");
}
const bot = new Bot(token);

await bot.api.setMyCommands([
	{ command: "table", description: "View the Latin-Armenian letter table" },
	{ command: "help", description: "Show help" },
]);

bot.command("table", async (ctx) => {
	await ctx.reply(formatTable(combinedFlatTables), { parse_mode: "HTML" });
});

bot.command("help", async (ctx) => {
	await ctx.reply(formatHelp(), { parse_mode: "HTML" });
});

bot.on("message:text", async (ctx) => {
	await ctx.reply(transliterate(ctx.message.text));
});

bot.start();
