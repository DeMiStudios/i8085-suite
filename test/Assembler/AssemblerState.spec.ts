import { AssemblerState } from "Assembler/AssemblerState";
import { TokenKind } from "Assembler/TokenKind";
import test, { before } from "ava";
import { unlinkSync, writeFileSync } from "fs";
import { createDiagnosticFactory, DiagnosticCategory } from "Shared/Diagnostic";

let state1: AssemblerState; // non-debug
let state2: AssemblerState; // debug

before("constructor()", t => {
	writeFileSync("_test_", "source\n", { encoding: "utf8" });
	state1 = new AssemblerState("_test_");
	unlinkSync("_test_");
	t.is(state1.file, "_test_");
	t.is(state1.debug, false);
	t.is(state1.source, "source\n");
	t.is(state1.lineMap.length, 0);
	t.is(state1.diagnostics.length, 0);
	t.is(state1.getCursorPosition(), 0);
	t.is(state1.getToken(), TokenKind.EndOfFile);
	t.is(state1.getTokenPosition(), 0);
	t.is(state1.getTokenLength(), 0);
	t.is(state1.getTokenLexeme(), "");
	t.is(state1.getSyntaxTree(), undefined);

	state2 = new AssemblerState("_test_", { debug: true, source: "source\n" });
	t.is(state2.debug, true);
	t.is(state2.source, "source\n");
	t.is(state2.lineMap.length, 2);
});

test("addDiagnostic() and formatDiagnostic()", t => {
	const helper = (state: AssemblerState, category: DiagnosticCategory) => {
		if (category !== DiagnosticCategory.Error || state.debug) {
			const n = state.diagnostics.length;
			state.addDiagnostic(createDiagnosticFactory(category, "message"));
			t.is(state.diagnostics.length, n + 1);
			t.deepEqual(state.diagnostics[n], {
				category: category,
				message: "message",
				file: "_test_",
				position: 0,
				length: 0
			});
			t.regex(
				state.formatDiagnostic(state.diagnostics[n]),
				state.debug ? /^_test_:1:1: (.*)message$/ : /message$/
			);
		} else {
			// fatal
			t.throws(() => state.addDiagnostic(createDiagnosticFactory(category, "message")), {
				message: /message$/
			});
		}
	};

	helper(state1, DiagnosticCategory.Note);
	helper(state1, DiagnosticCategory.Warning);
	helper(state1, DiagnosticCategory.Error);
	helper(state2, DiagnosticCategory.Note);
	helper(state2, DiagnosticCategory.Warning);
	helper(state2, DiagnosticCategory.Error);
});
