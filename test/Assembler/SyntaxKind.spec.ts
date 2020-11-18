import type { ExpressionKind, StatementKind } from "Assembler/SyntaxKind";
import { isExpressionKind, isStatementKind, SyntaxKind } from "Assembler/SyntaxKind";
import test from "ava";

test("isStatementKind()", t => {
	const statement: { readonly [K in StatementKind]: true } = {
		[SyntaxKind.Instruction]: true,
		[SyntaxKind.Label]: true
	};

	for (const kind of Object.values(SyntaxKind)) {
		if (typeof kind !== "string") {
			t.is(isStatementKind(kind), kind in statement);
		}
	}
});

test("isExpressionKind()", t => {
	const expression: { readonly [K in ExpressionKind]: true } = {
		[SyntaxKind.Identifier]: true,
		[SyntaxKind.Integer]: true
	};

	for (const kind of Object.values(SyntaxKind)) {
		if (typeof kind !== "string") {
			t.is(isExpressionKind(kind), kind in expression);
		}
	}
});
