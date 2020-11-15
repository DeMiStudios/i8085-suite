import type { DiagnosticFactory } from "Shared/Diagnostic";
import { createDiagnosticFactory, DiagnosticCategory } from "Shared/Diagnostic";
import { TokenKind } from "./TokenKind";

export const notes = {
	expectedLfAfterCR: createDiagnosticFactory(DiagnosticCategory.Note, "expected LF (\\n) after CR (\\r)"),
	expectedFinalNewline: createDiagnosticFactory(DiagnosticCategory.Note, "expected final newline")
};

export const errors = {
	unexpectedCharacter: (character: string): DiagnosticFactory =>
		createDiagnosticFactory(DiagnosticCategory.Error, `unexpected character '${character}'`),

	malformedInteger: (value: string): DiagnosticFactory =>
		createDiagnosticFactory(DiagnosticCategory.Error, `malformed integer '${value}'`),

	expectedToken: (kind: TokenKind, got: TokenKind): DiagnosticFactory =>
		createDiagnosticFactory(DiagnosticCategory.Error, `expected '${TokenKind[kind]}', got '${TokenKind[got]}'`),

	expectedStatement: (got: TokenKind): DiagnosticFactory =>
		createDiagnosticFactory(DiagnosticCategory.Error, `expected statement, got '${TokenKind[got]}'`)
};
