export type TLesson = {
	id: string;
	order: number;
	name: string;
	introText: string;
};

export const lessons: TLesson[] = [
	{
		id: "1",
		order: 1,
		name: "ԱՍՄ",
		introText: [
			"In the first lesson we'll practice three letters:",
			`- <b>Աա</b> = Aa. Pronounced as "u" in "bus"`,
			`- <b>Սս</b> = Ss. Pronounced as "s" in "smile"`,
			`- <b>Մմ</b> = Mm. Pronounced as "m" in "mountain"`,
			"",
			"These letters look similar. Let's try describing them in a way that will help you remember them:",
			"- <b>Աա</b> = Aa – the lowercase letter is long like a b<b>u</b>s. The uppercase has a pipe like a b<b>u</b>s",
			"- <b>Սս</b> = Ss – both look like a very wide <b>s</b>mile",
			"- <b>Մմ</b> = Mm – the lowercase letter is trying to seem taller than it is – it raises it's arm up to be as tall as a <b>m</b>ountain. The uppercase letter also shows how tall it is with its arm",
			"",
			"Ok, now let's practice:",
			"- We send you a letter or a combination of letters in Latin or Armenian letters",
			"- You send the same letter / combination in the opposite letters",
			"Let's go!",
		].join("\n"),
	},
];
