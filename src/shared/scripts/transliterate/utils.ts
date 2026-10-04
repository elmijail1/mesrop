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

export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
