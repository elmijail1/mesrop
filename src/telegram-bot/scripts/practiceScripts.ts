import type { Conversation } from "@grammyjs/conversations";
import type { Context } from "grammy";
import { lessons, type TLesson } from "../../shared/data/lessons.ts";
import {
	questions,
	type TDifficulty,
	type TQuestion,
} from "../../shared/data/questions.ts";
import type { MyContext } from "../context.ts";

const MAX_QUESTIONS_DEFAULT = 10;

export async function lessonConversation(
	conversation: Conversation<MyContext>,
	ctx: Context,
	lessonId: string,
) {
	const lesson = getLesson(lessonId); // first do it with static data, later make a DB query // TODO: change to a DB call once lesson data is moved there
	await ctx.reply(lesson.introText, { parse_mode: "HTML" });
	let correct = 0;
	const relevantQuestions = questions.filter((q) => q.lessonId === lessonId);
	for (let i = 0; i < MAX_QUESTIONS_DEFAULT; i++) {
		const question = await pickQuestion(conversation, relevantQuestions, i);
		await ctx.reply(`${i + 1}/${MAX_QUESTIONS_DEFAULT}. ${question.prompt}`);
		const answerCtx = await conversation.waitFor("message:text");
		if (answerCtx.hasCommand("end")) {
			await answerCtx.reply(
				`You've ended the lesson early.\nYou got ${correct}/${i} right.`,
			);
			return;
		}
		const isCorrect = answerCtx.message.text === question.expected;
		if (isCorrect) correct++;
		await answerCtx.reply(
			isCorrect
				? `✅ Correct!${question.tip ? `\n${question.tip}` : ""}`
				: `😭 Incorrect — it's ${question.expected}!${question.tip && `\n${question.tip}`}`,
		);
	}
	await ctx.reply(
		[
			`${determineResultMessage(correct, MAX_QUESTIONS_DEFAULT)}`,
			`You got ${correct}/${MAX_QUESTIONS_DEFAULT} right.`,
			"",
			"Want another quiz? Run /practice again",
			"Just want to turn Latin letters into Armenian? Simply start messaging",
		].join("\n"),
	);
}

function getLesson(id: string): TLesson {
	const lesson = lessons.find((l) => l.id === id);
	if (!lesson) throw new Error("Invalid lesson ID");
	return lesson;
}

async function pickQuestion(
	conversation: Conversation<MyContext>,
	questions: TQuestion[],
	index: number,
): Promise<TQuestion> {
	let difficulty: TDifficulty = "low";
	if (index > 2) difficulty = "medium";
	if (index > 6) difficulty = "high";
	const filteredQuestions = questions.filter(
		(q) => q.difficulty === difficulty,
	);
	const randomNum = await conversation.random();
	return filteredQuestions[Math.floor(randomNum * filteredQuestions.length)];
}

function determineResultMessage(correct: number, questionsNumber: number) {
	const percentage = (correct / questionsNumber) * 100;
	if (percentage === 100) return `😎 Perfect score! You rock!`;
	if (percentage >= 70) return `💪 Great job! You're nailing it!`;
	if (percentage >= 50) return `👍 Not bad! Just a little more practice!`;
	return `🥊 You still need some practice!`;
}
