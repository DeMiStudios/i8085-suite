import { expect } from "chai";
import { describe, it } from "mocha";
import {
	DiagnosticCategory,
	diagnosticFactory,
	getDiagnosticMessage,
	isDiagnosticWithLocation
} from "Shared/Diagnostic";

/* eslint-disable @typescript-eslint/no-unused-expressions */
describe("Test Diagnostics", () => {
	it("should support diagnostics", () => {
		const noteFactory = diagnosticFactory(DiagnosticCategory.Note, "note message");
		const noteDiagnostic = noteFactory("test", 1, 2);
		expect(isDiagnosticWithLocation(noteDiagnostic)).to.be.true;
		expect(getDiagnosticMessage(noteDiagnostic)).to.contain(noteDiagnostic.message);
		expect(noteDiagnostic).to.deep.equal({
			category: DiagnosticCategory.Note,
			message: "note message",
			file: "test",
			position: 1,
			length: 2
		});
	});
});
