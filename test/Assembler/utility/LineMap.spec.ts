import { generateLineMap, getLineAndColumnOfPosition } from "Assembler/utility/LineMap";
import test from "ava";

test("LineMap utility", t => {
	t.deepEqual(generateLineMap(""), [0]);

	const source = "first line\nsecond line\nthird line\n";
	const lineMap = generateLineMap(source);
	t.deepEqual(lineMap, [0, 11, 23, 34]);

	for (let pos = 0, line = 0, column = 0; pos < source.length; pos++) {
		t.deepEqual(getLineAndColumnOfPosition(lineMap, pos), [line, column]);
		column += 1;

		if (source[pos] === "\n") {
			line += 1;
			column = 0;
		}
	}
});
