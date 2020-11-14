import { assert } from "Shared/Debug";

export function isValidInteger(value: string): boolean {
	return (
		/^[0-9][0-9_]*$/.test(value) ||
		/^0[bB][01_]+$/.test(value) ||
		/^0[oO][0-7_]+$/.test(value) ||
		/^0[dD][0-9_]+$/.test(value) ||
		/^0[xX][0-9A-Fa-f_]+$/.test(value) ||
		/^[0-1][0-1_]*[bB]$/.test(value) ||
		/^[0-7][0-7_]*[oO]$/.test(value) ||
		/^[0-9][0-9_]*[dD]$/.test(value) ||
		/^[0-9][0-9A-Fa-f_]*[hH]$/.test(value)
	);
}

export function parseInteger(value: string): number | undefined {
	if (isValidInteger(value)) {
		let result: number;
		let prefix = /^0([a-zA-Z])/.exec(value)?.[1];
		let suffix = /([a-zA-Z])$/.exec(value)?.[1];

		// handle hexadecimal integer edge cases
		if (prefix && suffix) {
			if (prefix === "x" || prefix === "X") {
				// edge case 1: 0[xX][0-9A-Fa-f_]+
				suffix = undefined;
			} else {
				// edge case 2: 0[bBdD][0-9A-Fa-f_]*[hH]
				prefix = undefined;
			}
		}

		if (prefix) {
			result = parseInt(value.substr(2).replace(/_/g, ""), getRadixFromModifier(prefix));
		} else if (suffix) {
			result = parseInt(value.substr(0, value.length - 1).replace(/_/g, ""), getRadixFromModifier(suffix));
		} else {
			result = parseInt(value.replace(/_/g, ""), 10);
		}

		assert(!Number.isNaN(result));
		return result;
	} else {
		return undefined;
	}
}

function getRadixFromModifier(modifier: string): number {
	switch (modifier.toLowerCase()) {
		case "b":
			return 2;
		case "o":
			return 8;
		case "d":
			return 10;
		default:
			return 16;
	}
}
