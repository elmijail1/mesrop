const DIVIDER_CHARS = ["-", " ", "/", "(", '"', "“", "«", "–", "—"];

export function isInitChar(sub: string, ind: number): boolean {
	if (ind === 0) return true;
	if (
		DIVIDER_CHARS.includes(sub[ind - 1]) ||
		(sub[ind - 1] === "'" && DIVIDER_CHARS.includes(sub[ind - 2]))
	) {
		return true;
	}
	return false;
}

// counts characters (code points), not UTF-16 units, so e.g. emoji aren't split in half
export function clipText(text: string, max: number): string {
	return [...text].slice(0, max).join("");
}

export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
