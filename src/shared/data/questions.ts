// TODO: Think if it's perhaps better to make questions dynamically generated
export type TDifficulty = "low" | "medium" | "high";
export type TQuestion = {
	id: string;
	lessonId: string;
	difficulty: TDifficulty;
	prompt: string;
	expected: string;
	tip?: string;
};

const tips: Record<string, Record<string, string>> = {
	upper: {
		a: `A = Ա. Pronounced as "u" in "bus". Has a pipe like a bus 🚌`,
		m: `M = Մ. Pronounced as "m" in "mountain". With its right hand it shows that it's as tall as a mountain 🏔️`,
		s: `S = Ս. Pronounced as "s" in "smile". Looks like a wide smile 😃`,
	},
	lower: {
		a: `a = ա. Pronounced as "u" in "bus". It's also looong as a bus 🚌`,
		m: `m = մ. Pronounced as "m" in "mountain". With its right hand it shows that it's as tall as a mountain 🏔️`,
		s: `s = ս. Pronounced as "s" in "smile". Looks like a wide smile 😃`,
	},
};

export const questions: TQuestion[] = [
	{
		id: "1",
		lessonId: "1",
		difficulty: "low",
		prompt: "A (uppercase)",
		expected: "Ա",
		tip: tips.upper.a,
	},
	{
		id: "2",
		lessonId: "1",
		difficulty: "low",
		prompt: "Ա (uppercase)",
		expected: "A",
		tip: tips.upper.a,
	},
	{
		id: "3",
		lessonId: "1",
		difficulty: "low",
		prompt: "Ս (uppercase)",
		expected: "S",
		tip: tips.upper.s,
	},
	{
		id: "4",
		lessonId: "1",
		difficulty: "low",
		prompt: "S (uppercase)",
		expected: "Ս",
		tip: tips.upper.s,
	},
	{
		id: "5",
		lessonId: "1",
		difficulty: "low",
		prompt: "Մ (uppercase)",
		expected: "M",
		tip: tips.upper.m,
	},
	{
		id: "6",
		lessonId: "1",
		difficulty: "low",
		prompt: "M (uppercase)",
		expected: "Մ",
		tip: tips.upper.m,
	},
	{
		id: "7",
		lessonId: "1",
		difficulty: "low",
		prompt: "a (lowercase)",
		expected: "ա",
		tip: tips.lower.a,
	},
	{
		id: "8",
		lessonId: "1",
		difficulty: "low",
		prompt: "ա (lowercase)",
		expected: "a",
		tip: tips.lower.a,
	},
	{
		id: "9",
		lessonId: "1",
		difficulty: "low",
		prompt: "ս (lowercase)",
		expected: "s",
		tip: tips.lower.s,
	},
	{
		id: "10",
		lessonId: "1",
		difficulty: "low",
		prompt: "s (lowercase)",
		expected: "ս",
		tip: tips.lower.s,
	},
	{
		id: "11",
		lessonId: "1",
		difficulty: "low",
		prompt: "մ (lowercase)",
		expected: "m",
		tip: tips.lower.m,
	},
	{
		id: "12",
		lessonId: "1",
		difficulty: "low",
		prompt: "m (lowercase)",
		expected: "մ",
		tip: tips.lower.m,
	},
];
