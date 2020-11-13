export type LineMap = readonly number[];

export function generateLineMap(source: string): LineMap {
	let pos = 0;
	let char = source[pos];
	const lineMap = [0];

	while (char) {
		pos += 1;

		if (char === "\n") {
			lineMap.push(pos);
		}

		char = source[pos];
	}

	return lineMap;
}

/** 0-based line, position is a non-negative integer */
export function getLineOfPosition(lineMap: LineMap, position: number): number {
	let i = 0;
	let j = lineMap.length - 1;

	while (i < j) {
		const k = Math.floor((i + j) / 2);
		const lineStart = lineMap[k];

		if (i === k) {
			break;
		} else if (lineStart <= position) {
			i = k;
		} else {
			j = k - 1;
		}
	}

	return i;
}

/** 0-based line, 0-based column, position is a non-negative integer */
export function getLineAndColumnOfPosition(lineMap: LineMap, position: number): [line: number, column: number] {
	const line = getLineOfPosition(lineMap, position);
	return [line, position - lineMap[line]];
}
