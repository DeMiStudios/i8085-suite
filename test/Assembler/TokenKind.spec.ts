import type { LiteralTokenKind, PunctuatorTokenKind, TriviaTokenKind } from "Assembler/TokenKind";
import { isLiteralTokenKind, isPunctuatorTokenKind, isTriviaTokenKind, TokenKind } from "Assembler/TokenKind";
import test from "ava";

test("isTriviaKind()", t => {
	const trivia: { readonly [K in TriviaTokenKind]: true } = {
		[TokenKind.Space]: true,
		[TokenKind.Terminator]: true,
		[TokenKind.Comment]: true
	};

	for (const kind of Object.values(TokenKind)) {
		if (typeof kind !== "string") {
			t.is(isTriviaTokenKind(kind), kind in trivia);
		}
	}
});

test("isLiteralKind()", t => {
	const literal: { readonly [K in LiteralTokenKind]: true } = {
		[TokenKind.Identifier]: true,
		[TokenKind.Integer]: true
	};

	for (const kind of Object.values(TokenKind)) {
		if (typeof kind !== "string") {
			t.is(isLiteralTokenKind(kind), kind in literal);
		}
	}
});

test("isPunctuatorKind()", t => {
	const punctuator: { readonly [K in PunctuatorTokenKind]: true } = {
		[TokenKind.Delimiter]: true,
		[TokenKind.Colon]: true
	};

	for (const kind of Object.values(TokenKind)) {
		if (typeof kind !== "string") {
			t.is(isPunctuatorTokenKind(kind), kind in punctuator);
		}
	}
});
