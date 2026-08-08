import { conversations, createConversation } from "@grammyjs/conversations";
import { Bot, session } from "grammy";
import { lessons } from "../shared/data/lessons.ts";
import { combinedFlatTables } from "../shared/data/tables.ts";
import { transliterate } from "../shared/scripts/transliterate.ts";
import type { MyContext } from "./context.ts";
import { formatHelp, formatTable } from "./scripts/formatScripts.ts";
import { lessonConversation } from "./scripts/practiceScripts.ts";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
	throw new Error("Token invalid");
}
const bot = new Bot<MyContext>(token);

await bot.api.setMyCommands([
	{ command: "table", description: "View the Latin-Armenian letter table" },
	{ command: "practice", description: "Learn to read Armenian letters" },
	{ command: "help", description: "Show help" },
]);

bot.use(session({ initial: () => ({}) }));
bot.use(conversations());
bot.use(createConversation(lessonConversation));

bot.command("table", async (ctx) => {
	await ctx.reply(formatTable(combinedFlatTables), { parse_mode: "HTML" });
});

bot.command("practice", async (ctx) => {
	const lessonId = ctx.match || lessons[0]?.id;
	if (!lessonId || !lessons.some((l) => l.id === lessonId)) {
		await ctx.reply("No such lesson. Try /practice with a valid lesson id."); // TODO: change the comment
		return;
	}
	await ctx.conversation.enter("lessonConversation", lessonId);
});

bot.command(["help", "start"], async (ctx) => {
	await ctx.reply(formatHelp(), { parse_mode: "HTML" });
});

bot.on("message:text", async (ctx) => {
	await ctx.reply(transliterate(ctx.message.text));
});

bot.start();
