import type { TFlattenedMap } from "../shared/scripts/tableTransforms.ts";

export function printTable(flatTable: TFlattenedMap): void {
	const entries = Object.entries(flatTable);
	console.table(
		entries.map(([lat, arm]) => {
			if (typeof arm === "string") return { Latin: lat, Armenian: arm };
			if (arm.regular && arm.regular !== arm.init)
				return { Latin: lat, Armenian: `${arm.regular} / ${arm.init} (init.)` };
			if (!arm.regular && arm.init)
				return { Latin: `${lat} (init. only)`, Armenian: arm.init };
			return { Latin: lat, Armenian: arm.regular };
		}),
	);
}
