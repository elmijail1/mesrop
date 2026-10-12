// run with "node ...filepath"
import { createBot } from "../bot.ts";

// create a fake bot
const bot = createBot("123:fake", {
	botInfo: {
		id: 1,
		is_bot: true,
		first_name: "Test",
		username: "test_bot",
		can_join_groups: false,
		can_read_all_group_messages: false,
		supports_inline_queries: false,
		can_connect_to_business: false,
		has_main_web_app: false,
		has_topics_enabled: false,
		allows_users_to_create_topics: false,
		can_manage_bots: false,
		supports_join_request_queries: false,
	},
});

// intercept every API call, print it, and return a fake OK instead of connecting Telegram
bot.api.config.use(async (_prev, method, payload) => {
	console.log(method, payload);
	return { ok: true, result: true } as never;
});

// fake incoming message
function message(text: string) {
	const isCommand = text.startsWith("/");
	return {
		update_id: 1,
		message: {
			message_id: 1,
			date: 0,
			chat: { id: 1, type: "private" as const, first_name: "User" },
			from: { id: 1, is_bot: false, first_name: "User" },
			text,
			...(isCommand && {
				entities: [
					{
						type: "bot_command" as const,
						offset: 0,
						length: text.split(" ")[0].length,
					},
				],
			}),
		},
	};
}

// feed messages through different handlers, just as if they came to bot from Telegram
await bot.handleUpdate(message("barev dzez"));
await bot.handleUpdate(message("Բարև"));
await bot.handleUpdate(message("123"));
await bot.handleUpdate(message("/practice"));
