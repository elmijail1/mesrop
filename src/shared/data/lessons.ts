export type TLesson = {
	id: string;
	order: number;
	name: string;
	characters: TLessonCharacters;
	// TODO: Zod schema must add up the difficulty numbers and make sure the total doesn't exceed 10 (make this 10 a global config!)
	difficulty: TLessonDifficulty;
	introTextRows: string[];
};

export type TLessonCharacters = {
	vowels: string[];
	consonants: string[];
};

export type TLessonDifficulty = {
	low: number;
	normal: number;
	high: number;
};

export const lessons: TLesson[] = [
	{
		id: "1",
		order: 10,
		name: "Ա Ս Մ – A S M",
		characters: {
			vowels: ["ա"],
			consonants: ["ս", "մ"],
		},
		difficulty: {
			low: 3,
			normal: 4,
			high: 3,
		},
		introTextRows: [
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
		],
	},
	{
		id: "2",
		order: 20,
		name: "Բ Ի Ր – B I R",
		characters: {
			vowels: ["ի"],
			consonants: ["բ", "ր"],
		},
		difficulty: {
			low: 3,
			normal: 4,
			high: 3,
		},
		introTextRows: [
			"In the second lesson we'll practice three more letters:",
			`- <b>Բբ</b> = Bb. Pronounced as "b" in "bang"`,
			`- <b>Իի</b> = Ii. Pronounced as "i" in "kick"`,
			`- <b>Րր</b> = Rr. Pronounced roughly as "r" in "rock"`,
			"",
			"These letters look similar. Let's try describing them in a way that will help you remember them:",
			"- <b>Բբ</b> = Bb – in a way, you can see a head profile with a Braid on the left",
			"- <b>Իի</b> = Ii – the uppercase one looks like a person kIcking someone with their leg. The lowercase one is a person about to make a kIck (with a leg bent at knee)",
			"- <b>Րր</b> = Rr – they look like a cane that you can gRab something with",
			"",
		],
	},
];
