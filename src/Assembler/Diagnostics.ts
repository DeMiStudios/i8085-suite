import type { DiagnosticFactory } from "Shared/Diagnostic";
import { DiagnosticCategory, diagnosticFactory } from "Shared/Diagnostic";

export const notes = {
	expectedLfAfterCR: diagnosticFactory(DiagnosticCategory.Note, "expected LF (\\n) after CR (\\r)"),
	expectedFinalNewline: diagnosticFactory(DiagnosticCategory.Note, "expected final newline")
};

export const errors = {
	unexpectedCharacter: (character: string): DiagnosticFactory =>
		diagnosticFactory(DiagnosticCategory.Error, `unexpected character '${escape(character)}'`),

	badLabelName: (name: string): DiagnosticFactory =>
		diagnosticFactory(DiagnosticCategory.Error, `bad label name '${escape(name)}'`),

	malformedInteger: (value: string): DiagnosticFactory =>
		diagnosticFactory(DiagnosticCategory.Error, `malformed integer '${escape(value)}'`)
};
