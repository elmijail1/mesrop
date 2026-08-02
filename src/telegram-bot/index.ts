import { Bot } from "grammy";
import { transliterate } from "../shared/scripts/transliterate.ts";
import { combinedFlatTables } from "../shared/tables.ts";
import { formatTable } from "./scripts.ts";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
	throw new Error("Token invalid");
}
const bot = new Bot(token);

bot.command("table", async (ctx) => {
	await ctx.reply(formatTable(combinedFlatTables), { parse_mode: "HTML" });
});

bot.on("message:text", async (ctx) => {
	await ctx.reply(transliterate(ctx.message.text));
});

bot.start();
