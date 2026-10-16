import type { InlineKeyboard } from "grammy";
import type { Update, UserFromGetMe } from "grammy/types";
import { describe, expect, it } from "vitest";
import { MAX_INPUT_LENGTH } from "../shared/configs/transliteration.ts";
import { lessons } from "../shared/data/lessons.ts";
import { transliterate } from "../shared/scripts/transliterate/transliterate.ts";
import { clipText } from "../shared/scripts/transliterate/utils.ts";
import { createBot } from "./bot.ts";
import { BOT_COMMANDS } from "./commands.ts";
import {
	ERROR_MESSAGE_UNKNOWN_SCRIPT,
	WARNING_MESSAGE_TRUNCATED,
} from "./messages.ts";

type TApiCall = { method: string; payload: Record<string, unknown> };

const BOT_INFO: UserFromGetMe = {
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
};

async function send(text: string): Promise<TApiCall[]> {
	const bot = createBot("123:fake", { botInfo: BOT_INFO });
	const calls: TApiCall[] = [];
	bot.api.config.use(async (_prev, method, payload) => {
		calls.push({ method, payload: payload as Record<string, unknown> });
		return { ok: true, result: true } as never;
	});

	const commandLength = text.startsWith("/") ? text.split(" ")[0].length : 0;
	const update: Update = {
		update_id: 1,
		message: {
			message_id: 1,
			date: 0,
			chat: { id: 1, type: "private", first_name: "User" },
			from: { id: 1, is_bot: false, first_name: "User" },
			text,
			...(commandLength && {
				entities: [{ type: "bot_command", offset: 0, length: commandLength }],
			}),
		},
	};
	await bot.handleUpdate(update);
	return calls;
}

async function sendAndGetReply(text: string): Promise<Record<string, unknown>> {
	const calls = await send(text);
	expect(calls).toHaveLength(1);
	expect(calls[0].method).toBe("sendMessage");
	return calls[0].payload;
}

describe("bot", () => {
	describe("transliteration", () => {
		it("transliterates Latin text to Armenian as plain text", async () => {
			const reply = await sendAndGetReply("barev dzez");
			expect(reply.text).toBe("բարև ձեզ");
			expect(reply).not.toHaveProperty("parse_mode");
		});

		it("transliterates Armenian text to Latin", async () => {
			const reply = await sendAndGetReply("Բարև");
			expect(reply.text).toBe("Barev");
		});

		it("replies with an error to a text without supported letters", async () => {
			const reply = await sendAndGetReply("123");
			expect(reply.text).toBe(ERROR_MESSAGE_UNKNOWN_SCRIPT);
		});

		it("transliterates only the clipped part of an excessive text and warns about it", async () => {
			const input = "a".repeat(MAX_INPUT_LENGTH * 2);
			const reply = await sendAndGetReply(input);
			expect(reply.text).toBe(
				`${transliterate(clipText(input, MAX_INPUT_LENGTH))}…\n\n${WARNING_MESSAGE_TRUNCATED}`,
			);
		});
	});

	describe("commands", () => {
		it("/help mentions every command of the menu", async () => {
			const reply = await sendAndGetReply("/help");
			expect(reply.parse_mode).toBe("HTML");
			for (const { command } of BOT_COMMANDS) {
				expect(reply.text).toContain(`/${command}`);
			}
		});

		it("/table shows the letter table", async () => {
			const reply = await sendAndGetReply("/table");
			expect(reply.parse_mode).toBe("HTML");
			expect(reply.text).toContain("<pre>");
			expect(reply.text).toContain("</pre>");
			expect(reply.text).toMatch(/^b\s+բ$/m);
			expect(reply.text).toMatch(/^sh\s+շ$/m);
		});

		it("/practice offers a button for every lesson", async () => {
			const reply = await sendAndGetReply("/practice");
			const keyboard = reply.reply_markup as InlineKeyboard;
			const callbacks = keyboard.inline_keyboard
				.flat()
				.map((button) => "callback_data" in button && button.callback_data);
			expect(callbacks).toEqual(lessons.map(({ id }) => `practice:${id}`));
		});
	});
});
