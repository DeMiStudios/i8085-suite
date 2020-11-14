import { Assembler } from "Assembler/Assembler";
import { errors, notes } from "Assembler/Diagnostics";
import { scan } from "Assembler/Scanner";
import { isTriviaKind, SyntaxKind } from "Assembler/SyntaxKind";
import test from "ava";
import type { Diagnostic } from "Shared/Diagnostic";

test("scan() - no diagnostics", t => {
	const source = `
label: ; comment
mvi a, 123 ; a = 123
mov b, a ; b = a
identifier 123
`;
	const expected: readonly (readonly [SyntaxKind, string])[] = [
		[SyntaxKind.Terminator, "\n"],
		// label: ; comment
		[SyntaxKind.Label, "label:"],
		[SyntaxKind.Space, " "],
		[SyntaxKind.Comment, "; comment"],
		[SyntaxKind.Terminator, "\n"],
		// mvi a, 123 ; a = 123
		[SyntaxKind.Opcode, "mvi"],
		[SyntaxKind.Space, " "],
		[SyntaxKind.Register, "a"],
		[SyntaxKind.Delimiter, ","],
		[SyntaxKind.Space, " "],
		[SyntaxKind.Integer, "123"],
		[SyntaxKind.Space, " "],
		[SyntaxKind.Comment, "; a = 123"],
		[SyntaxKind.Terminator, "\n"],
		// mov b, a ; b = a
		[SyntaxKind.Opcode, "mov"],
		[SyntaxKind.Space, " "],
		[SyntaxKind.Register, "b"],
		[SyntaxKind.Delimiter, ","],
		[SyntaxKind.Space, " "],
		[SyntaxKind.Register, "a"],
		[SyntaxKind.Space, " "],
		[SyntaxKind.Comment, "; b = a"],
		[SyntaxKind.Terminator, "\n"],
		// identifier 123
		[SyntaxKind.Identifier, "identifier"],
		[SyntaxKind.Space, " "],
		[SyntaxKind.Integer, "123"],
		[SyntaxKind.Terminator, "\n"]
	];

	const scanHelper = (state: Assembler): readonly [SyntaxKind, string] | undefined => {
		const kind = scan(state);
		return kind ? [kind, state.getLexeme()] : undefined;
	};

	// without trivia
	{
		const state = new Assembler("test", { source });
		t.is(state.diagnostics.length, 0);
		t.deepEqual(
			[...makeCallableIterable(scanHelper, state)],
			expected.filter(token => !isTriviaKind(token[0]))
		);
	}

	// with trivia
	{
		const state = new Assembler("test", { source, skipTrivia: false });
		t.is(state.diagnostics.length, 0);
		t.deepEqual([...makeCallableIterable(scanHelper, state)], expected);
	}
});

test("scan() - diagnostics", t => {
	const source = "\r\n?\rmov:  12F";

	const expected: readonly (readonly [SyntaxKind, string])[] = [
		[SyntaxKind.Terminator, "\r\n"],
		[SyntaxKind.Terminator, "\r"],
		[SyntaxKind.Label, "mov:"],
		[SyntaxKind.Space, "  "],
		[SyntaxKind.Integer, "12F"]
	] as readonly (readonly [SyntaxKind, string])[];

	const diagnostics: readonly Diagnostic[] = [
		errors.unexpectedCharacter("?")("test", 2, 1),
		notes.expectedLfAfterCR("test", 3, 1),
		errors.badLabelName("mov")("test", 4, 4),
		errors.malformedInteger("12F")("test", 10, 3),
		notes.expectedFinalNewline("test", 13, 0)
	];

	const scanHelper = (state: Assembler): readonly [SyntaxKind, string] | undefined => {
		const kind = scan(state);
		return kind ? [kind, state.getLexeme()] : undefined;
	};

	// no debug
	{
		const state = new Assembler("test", { source });
		t.throws(() => void [...makeCallableIterable(scanHelper, state)], {
			message: state.formatDiagnostic(diagnostics[0])
		});
	}

	// debug
	{
		const state = new Assembler("test", { source, debug: true, skipTrivia: false });
		t.deepEqual([...makeCallableIterable(scanHelper, state)], expected);
		t.deepEqual(state.diagnostics, diagnostics);
	}
});

function* makeCallableIterable<P extends readonly unknown[], R>(
	callable: (...params: P) => R,
	...args: P
): Generator<NonNullable<R>, void> {
	let value = callable(...args);

	while (value !== null && value !== undefined) {
		yield value as never;
		value = callable(...args);
	}
}
