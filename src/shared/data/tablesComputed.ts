import { combineFlatTables, invertTable } from "../scripts/flattenTable.ts";
import { alphabetMap, specialInitChars } from "./tables.ts";

export const combinedFlatTables = combineFlatTables(
	alphabetMap,
	specialInitChars,
);

export const alphabetMapArmenianFirst = invertTable(
	Object.entries(alphabetMap),
);
export const specialInitCharsArmenianFirst = invertTable(
	Object.entries(specialInitChars),
);
