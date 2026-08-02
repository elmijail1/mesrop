import { Bot } from "grammy";
import { transliterate } from "../shared/scripts/transliterate.ts";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
	throw new Error("Token invalid");
}
const bot = new Bot(token);

bot.on("message:text", async (ctx) => {
	await ctx.reply(transliterate(ctx.message.text));
});

bot.start();
