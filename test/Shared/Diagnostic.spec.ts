import test from "ava";
import type { Diagnostic } from "Shared/Diagnostic";
import {
	createDiagnosticFactory,
	DiagnosticCategory,
	getDiagnosticMessage,
	isDiagnosticWithLocation
} from "Shared/Diagnostic";

test("createDiagnosticFactory()", t => {
	const factory = createDiagnosticFactory(DiagnosticCategory.Note, "note message");
	const diagnostic = factory("test", 0, 5);

	t.deepEqual(diagnostic, {
		category: DiagnosticCategory.Note,
		message: "note message",
		file: "test",
		position: 0,
		length: 5
	});
});

test("isDiagnosticWithLocation()", t => {
	const diagnostic: Diagnostic = {
		category: DiagnosticCategory.Note,
		message: "note message"
	};

	const diagnosticWithLocation: Diagnostic = {
		...diagnostic,
		file: "test",
		position: 0,
		length: 5
	};

	t.false(isDiagnosticWithLocation(diagnostic));
	t.true(isDiagnosticWithLocation(diagnosticWithLocation));
});

test("getDiagnosticMessage()", t => {
	const diagnostic: Diagnostic = {
		category: DiagnosticCategory.Note,
		message: "message"
	};

	t.regex(getDiagnosticMessage(diagnostic), /message/);
});
