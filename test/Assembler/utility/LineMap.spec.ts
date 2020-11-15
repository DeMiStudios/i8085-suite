import { generateLineMap, getLineAndColumnOfPosition } from "Assembler/utility/LineMap";
import test from "ava";

test("generateLineMap()", t => {
	t.deepEqual(generateLineMap(""), [0]);
	t.deepEqual(generateLineMap("\n"), [0, 1]);
	t.deepEqual(generateLineMap("\n\n"), [0, 1, 2]);
	t.deepEqual(generateLineMap("1\n22\n333"), [0, 2, 5]);
	t.deepEqual(generateLineMap("1\n22\n333\n"), [0, 2, 5, 9]);
});

test("getLineAndColumnOfPosition() - no final newline", t => {
	const source = "first line\nsecond line\nthird line";
	const lineMap = generateLineMap(source);

	for (let position = 0, line = 0, column = 0; position < source.length; position++) {
		t.deepEqual(getLineAndColumnOfPosition(lineMap, position), [line, column]);
		column += 1;

		if (source[position] === "\n") {
			line += 1;
			column = 0;
		}
	}
});

test("getLineAndColumnOfPosition() - final newline", t => {
	const source = "first line\nsecond line\nthird line\n";
	const lineMap = generateLineMap(source);

	for (let position = 0, line = 0, column = 0; position < source.length; position++) {
		t.deepEqual(getLineAndColumnOfPosition(lineMap, position), [line, column]);
		column += 1;

		if (source[position] === "\n") {
			line += 1;
			column = 0;
		}
	}
});
