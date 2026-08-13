import type { Conversation } from "@grammyjs/conversations";
import type { Context } from "grammy";
import {
	MAX_QUESTIONS_DEFAULT,
	PHRASE_LENGTH_DEFAULT,
	WORD_LENGTH_DEFAULT,
} from "../../shared/configs/lessons.ts";
import {
	lessons,
	type TLesson,
	type TLessonCharacters,
	type TLessonDifficulty,
} from "../../shared/data/lessons.ts";
import { transliterate } from "../../shared/scripts/transliterate/transliterate.ts";
import { transliterateFromArm } from "../../shared/scripts/transliterate/transliterateFromArm.ts";
import type { MyContext } from "../context.ts";

export async function lessonConversation(
	conversation: Conversation<MyContext>,
	ctx: Context,
	lessonId: string,
) {
	const lesson = getLesson(lessonId); // first do it with static data, later make a DB query // TODO: change to a DB call once lesson data is moved there
	const preparedIntroText = lesson.introTextRows.join("\n");
	await ctx.reply(preparedIntroText, { parse_mode: "HTML" });
	let correct = 0;

	for (let i = 0; i < MAX_QUESTIONS_DEFAULT; i++) {
		const question = await generateQuestion(
			conversation,
			lesson.characters,
			i,
			lesson.difficulty,
		);
		await ctx.reply(`${i + 1}/${MAX_QUESTIONS_DEFAULT}. ${question}`);
		const answerCtx = await conversation.waitFor("message:text");
		if (answerCtx.hasCommand("end")) {
			await answerCtx.reply(
				`You've ended the lesson early.\nYou got ${correct}/${i} right.`,
			);
			return;
		}
		const userResponse = answerCtx.message.text;
		const isCorrect = transliterate(userResponse) === question;
		if (isCorrect) correct++;
		// TODO: show the correct value for the incorrect response – you'll need an Armenian-first table for that
		await answerCtx.reply(
			isCorrect
				? "✅ Correct!"
				: `😭 Incorrect! It must be "${transliterateFromArm(question)}".`,
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

async function generateQuestion(
	conversation: Conversation<MyContext>,
	chars: TLessonCharacters,
	index: number,
	difficulty: TLessonDifficulty,
): Promise<string> {
	if (index < difficulty.low) {
		const allChars = [...chars.consonants, ...chars.vowels];
		const randNum = await conversation.random();
		const randomChar = getRandomChar(allChars, randNum);
		const shouldBeUpper = await determineIfUpper(conversation);
		return shouldBeUpper ? randomChar.toUpperCase() : randomChar;
	} else if (index < difficulty.low + difficulty.normal) {
		return await generateWord(conversation, chars);
	} else {
		return await generatePhrase(conversation, chars);
	}
}

async function determineIfUpper(conversation: Conversation<MyContext>) {
	const rand = await conversation.random();
	return Boolean(Math.floor(rand * 2));
}

function getRandomChar(letters: string[], random: number): string {
	return letters[Math.floor(random * letters.length)];
}

async function generateWord(
	conversation: Conversation<MyContext>,
	chars: TLessonCharacters,
	wordIndex?: number,
) {
	const randNum = await conversation.random();
	const wordLength = getRandomLength(
		randNum,
		WORD_LENGTH_DEFAULT.MAX,
		WORD_LENGTH_DEFAULT.MIN,
	);
	const wordChars: string[] = [];
	let prev: "none" | "con" | "vow" = "none";
	for (let i = 0; i < wordLength; i++) {
		const randNum = await conversation.random();
		if (i === 0 && (wordIndex === undefined || wordIndex === 0)) {
			const allLetters = [...chars.consonants, ...chars.vowels];
			const char = getRandomChar(allLetters, randNum);
			wordChars.push(char.toUpperCase());
			if (chars.consonants.includes(char)) {
				prev = "con";
			} else {
				prev = "vow";
			}
			continue;
		}
		if (prev === "con") {
			const char = getRandomChar(chars.vowels, randNum);
			wordChars.push(char);
			prev = "vow";
		} else {
			const char = getRandomChar(chars.consonants, randNum);
			wordChars.push(char);
			prev = "con";
		}
	}
	return wordChars.join("");
}

async function generatePhrase(
	conversation: Conversation<MyContext>,
	chars: TLessonCharacters,
) {
	const randNum = await conversation.random();
	const phraseLength = getRandomLength(
		randNum,
		PHRASE_LENGTH_DEFAULT.MAX,
		PHRASE_LENGTH_DEFAULT.MIN,
	);
	const phrase: string[] = [];
	for (let i = 0; i < phraseLength; i++) {
		const word = await generateWord(conversation, chars, i);
		phrase.push(word);
	}
	return phrase.join(" ");
}

function getRandomLength(
	randNum: number,
	maxVal: number,
	minVal: number,
): number {
	return Math.floor(randNum * (maxVal - minVal + 1)) + minVal;
}

function determineResultMessage(correct: number, questionsNumber: number) {
	const percentage = (correct / questionsNumber) * 100;
	if (percentage === 100) return `😎 Perfect score! You rock!`;
	if (percentage >= 70) return `💪 Great job! You're nailing it!`;
	if (percentage >= 50) return `👍 Not bad! Just a little more practice!`;
	return `🥊 You still need some practice!`;
}
