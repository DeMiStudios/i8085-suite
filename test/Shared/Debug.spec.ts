import test from "ava";
import { assert, assertIsDefined } from "Shared/Debug";

test("assert()", t => {
	t.throws(() => assert(false));
	t.notThrows(() => assert(true));
});

test("assertIsDefined()", t => {
	t.throws(() => assertIsDefined(undefined));
	t.notThrows(() => assertIsDefined(true));
});
