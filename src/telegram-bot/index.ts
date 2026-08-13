import { conversations, createConversation } from "@grammyjs/conversations";
import { Bot, InlineKeyboard, session } from "grammy";
import { lessons } from "../shared/data/lessons.ts";
import { combinedFlatTables } from "../shared/data/tablesComputed.ts";
import { transliterate } from "../shared/scripts/transliterate/transliterate.ts";
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

bot.command(["help", "start"], async (ctx) => {
	await ctx.reply(formatHelp(), { parse_mode: "HTML" });
});

bot.command("practice", async (ctx) => {
	const keyboard = new InlineKeyboard();
	for (let i = 0; i < lessons.length; i++) {
		const lesson = lessons[i];
		keyboard.text(`${i + 1}. ${lesson.name}`, `practice:${lesson.id}`).row();
	}
	await ctx.reply("What letters do you want to practice?", {
		reply_markup: keyboard,
	});
});

bot.callbackQuery(/^practice:(.+)/, async (ctx) => {
	const lessonId = ctx.match[1];
	if (!lessonId || !lessons.some((l) => l.id === lessonId)) {
		await ctx.answerCallbackQuery({
			text: "No such lesson – try another one",
			show_alert: true,
		});
		return;
	}
	await ctx.answerCallbackQuery();
	await ctx.conversation.enter("lessonConversation", lessonId);
});

bot.on("message:text", async (ctx) => {
	await ctx.reply(transliterate(ctx.message.text));
});

bot.start();
