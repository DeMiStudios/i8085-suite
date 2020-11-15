import { errors, notes } from "Assembler/Diagnostics";
import test from "ava";
import { DiagnosticCategory } from "Shared/Diagnostic";

test("notes", t => {
	for (const factory of Object.values(notes)) {
		const note = factory("test", 0, 0);
		t.is(note.category, DiagnosticCategory.Note);
	}
});

test("errors", t => {
	for (const factory of Object.values(errors)) {
		const error = factory(0 as never)("test", 0, 0);
		t.is(error.category, DiagnosticCategory.Error);
	}
});
