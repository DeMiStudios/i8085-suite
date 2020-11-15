import { isValidInteger, parseInteger } from "Assembler/utility/Integer";
import test from "ava";

test("isValidInteger() and parseInteger()", t => {
	// no prefix/suffix
	t.is(parseInteger("0"), 0);
	t.is(parseInteger("999"), 999);
	t.is(parseInteger("1_000"), 1000);

	// prefix
	t.is(parseInteger("0b10"), 2);
	t.is(parseInteger("0B10"), 2);
	t.is(parseInteger("0o10"), 8);
	t.is(parseInteger("0O10"), 8);
	t.is(parseInteger("0d10"), 10);
	t.is(parseInteger("0D10"), 10);
	t.is(parseInteger("0xf"), 15);
	t.is(parseInteger("0Xf"), 15);

	// suffix
	t.is(parseInteger("10b"), 2);
	t.is(parseInteger("10B"), 2);
	t.is(parseInteger("10o"), 8);
	t.is(parseInteger("10O"), 8);
	t.is(parseInteger("10d"), 10);
	t.is(parseInteger("10D"), 10);
	t.is(parseInteger("0fh"), 15);
	t.is(parseInteger("0fH"), 15);

	// edge cases
	t.is(parseInteger("0xb"), 11);
	t.is(parseInteger("0bh"), 11);
	t.is(parseInteger("0xd"), 13);
	t.is(parseInteger("0dh"), 13);

	// malformed cases
	t.is(isValidInteger(""), false);
	t.is(isValidInteger(" "), false);
	t.is(isValidInteger("_"), false);
	t.is(isValidInteger("a"), false);
	t.is(isValidInteger("fh"), false);
});
