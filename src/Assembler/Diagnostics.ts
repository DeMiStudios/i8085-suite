import type { DiagnosticFactory } from "Shared/Diagnostic";
import { createDiagnosticFactory, DiagnosticCategory } from "Shared/Diagnostic";
import { TokenKind } from "./TokenKind";

export const notes = {
	// Scanner diagnostics
	expectedLfAfterCR: createDiagnosticFactory(DiagnosticCategory.Note, "expected LF (\\n) after CR (\\r)"),
	expectedFinalNewline: createDiagnosticFactory(DiagnosticCategory.Note, "expected final newline")
};

export const errors = {
	// Scanner diagnostics
	unexpectedCharacter: (character: string): DiagnosticFactory =>
		createDiagnosticFactory(DiagnosticCategory.Error, `unexpected character '${character}'`),

	malformedInteger: (value: string): DiagnosticFactory =>
		createDiagnosticFactory(DiagnosticCategory.Error, `malformed integer '${value}'`),

	// Parser diagnostics
	expectedStatement: (got: TokenKind): DiagnosticFactory =>
		createDiagnosticFactory(DiagnosticCategory.Error, `expected statement, got '${TokenKind[got]}'`),

	expectedExpression: (got: TokenKind): DiagnosticFactory =>
		createDiagnosticFactory(DiagnosticCategory.Error, `expected expression, got '${TokenKind[got]}'`),

	expectedTerminatorAfterInstruction: (got: TokenKind): DiagnosticFactory =>
		createDiagnosticFactory(
			DiagnosticCategory.Error,
			`expected '${TokenKind[TokenKind.Terminator]}' after Instruction, got '${TokenKind[got]}'`
		)
};
