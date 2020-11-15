import { createList, isList } from "Assembler/ast/List";
import test from "ava";

test("createList()", t => {
	const list = createList();
	t.is(list.nodes.length, 0);
});

test("isList()", t => {
	const list = createList();
	t.true(isList(list));
	t.false(isList({}));
});
