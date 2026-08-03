import type { ConversationFlavor } from "@grammyjs/conversations";
import type { Context, SessionFlavor } from "grammy";

type SessionData = Record<string, never>;
export type MyContext = ConversationFlavor<
	Context & SessionFlavor<SessionData>
>;
