export type TTranslitNode = string | { [key: string]: TTranslitNode };
type TTranslitTable = Record<string, TTranslitNode>;

export const alphabetMap: TTranslitTable = {
	a: {
		a: "ա",
		ah: "ը",
	},
	b: "բ",
	c: {
		c: "ծ",
		"c'": "ց",
		ch: {
			ch: "ճ",
			"ch'": "չ",
		},
	},
	d: {
		d: "դ",
		dz: "ձ",
	},
	e: {
		e: "ե",
		eh: "է",
		ev: "և",
	},
	f: "ֆ",
	g: {
		g: "գ",
		gh: "ղ",
	},
	h: "հ",
	i: "ի",
	j: "ջ",
	k: {
		k: "կ",
		kh: "խ",
		"k'": "ք",
	},
	l: "լ",
	m: "մ",
	n: "ն",
	o: "ո",
	p: {
		p: "պ",
		"p'": "փ",
		ph: "փ",
	},
	q: "ք",
	r: {
		r: "ր",
		rr: "ռ",
	},
	s: {
		s: "ս",
		sh: "շ",
	},
	t: {
		t: "տ",
		"t'": "թ",
		th: "թ",
		ts: {
			ts: "ծ",
			"ts'": "ց",
		},
	},
	u: "ու",
	v: "վ",
	w: "ւ",
	x: "խ",
	y: "յ",
	z: {
		z: "զ",
		zh: "ժ",
	},
};

export const specialInitChars: TTranslitTable = {
	o: "օ",
	e: {
		e: "է",
		eh: "է",
	},
	v: {
		v: "վ",
		vo: "ո",
	},
	y: {
		y: "յ",
		ye: "ե",
		yev: "և",
	},
};
