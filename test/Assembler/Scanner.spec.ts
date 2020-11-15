import { AssemblerState } from "Assembler/AssemblerState";
import { errors, notes } from "Assembler/Diagnostics";
import { scan } from "Assembler/Scanner";
import { TokenKind } from "Assembler/TokenKind";
import test from "ava";
import type { Diagnostic } from "Shared/Diagnostic";

test("scan() - no diagnostics", t => {
	const source = "\nlabel: ; comment\nmvi a, 123\n";

	const expected: readonly (readonly [TokenKind, string])[] = [
		[TokenKind.Terminator, "\n"],
		// label: ; comment
		[TokenKind.Identifier, "label"],
		[TokenKind.Colon, ":"],
		[TokenKind.Space, " "],
		[TokenKind.Comment, "; comment"],
		[TokenKind.Terminator, "\n"],
		// mvi a, 123
		[TokenKind.Identifier, "mvi"],
		[TokenKind.Space, " "],
		[TokenKind.Identifier, "a"],
		[TokenKind.Delimiter, ","],
		[TokenKind.Space, " "],
		[TokenKind.Integer, "123"],
		[TokenKind.Terminator, "\n"],
		// end of file
		[TokenKind.EndOfFile, ""]
	];

	const state = new AssemblerState("test", { source });
	t.is(state.diagnostics.length, 0);
	t.deepEqual(getTokens(state), expected);
});

test("scan() - diagnostics", t => {
	const source = "\r\n?\rmov:  12F";

	const expected: readonly (readonly [TokenKind, string])[] = [
		[TokenKind.Terminator, "\r\n"],
		[TokenKind.Terminator, "\r"],
		// mov:  12F
		[TokenKind.Identifier, "mov"],
		[TokenKind.Colon, ":"],
		[TokenKind.Space, "  "],
		[TokenKind.Integer, "12F"],
		// end of file
		[TokenKind.EndOfFile, ""]
	] as readonly (readonly [TokenKind, string])[];

	const diagnostics: readonly Diagnostic[] = [
		errors.unexpectedCharacter("?")("test", 2, 1),
		notes.expectedLfAfterCR("test", 3, 1),
		errors.malformedInteger("12F")("test", 10, 3),
		notes.expectedFinalNewline("test", 13, 0)
	];

	// no debug
	const state1 = new AssemblerState("test", { source });
	t.throws(() => void getTokens(state1), {
		message: state1.formatDiagnostic(diagnostics[0])
	});

	// debug
	const state2 = new AssemblerState("test", { source, debug: true });
	t.deepEqual(getTokens(state2), expected);
	t.deepEqual(state2.diagnostics, diagnostics);
});

function getTokens(state: AssemblerState) {
	const tokens: [TokenKind, string][] = [];
	let kind = scan(state);

	while (kind !== TokenKind.EndOfFile) {
		tokens.push([kind, state.getTokenLexeme()]);
		kind = scan(state);
	}

	tokens.push([kind, state.getTokenLexeme()]);
	return tokens;
}
