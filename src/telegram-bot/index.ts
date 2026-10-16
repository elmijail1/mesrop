import { createBot } from "./bot.ts";
import { BOT_COMMANDS } from "./commands.ts";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
	throw new Error("Token invalid");
}
const bot = createBot(token);

await bot.api.setMyCommands(BOT_COMMANDS);

bot.start();
