export type LineMap = readonly number[];

export function generateLineMap(source: string): LineMap {
	let position = 0;
	let char = source[position];
	const lineMap = [0];

	while (char) {
		position += 1;

		if (char === "\n") {
			lineMap.push(position);
		}

		char = source[position];
	}

	return lineMap;
}

/** 0-based line, position is a non-negative integer */
export function getLineOfPosition(lineMap: LineMap, position: number): number {
	let i = 0;
	let n = lineMap.length;

	while (n > 1) {
		const step = n >> 1;
		const k = Math.floor(i + step);

		if (lineMap[k] <= position) {
			i = k;
			n -= step;
		} else {
			n = step;
		}
	}

	return i;
}

/** 0-based line, 0-based column, position is a non-negative integer */
export function getLineAndColumnOfPosition(lineMap: LineMap, position: number): [line: number, column: number] {
	const line = getLineOfPosition(lineMap, position);
	return [line, position - lineMap[line]];
}
