import i8085 from "i8085";
import { assert, assertIsDefined } from "Shared/Debug";
import type { Assembler } from "./Assembler";
import { errors, notes } from "./Diagnostics";
import { SyntaxKind } from "./SyntaxKind";
import { isValidInteger } from "./utility/Integer";

/**
 * Advances the scanner's state.
 * @returns The syntax kind, or `undefined` on end of file.
 */
export function scan(state: Assembler): SyntaxKind | undefined {
	const char = peekChar(state);
	state.lastPosition = state.position;

	if (char) {
		if (spaceRegexp.test(char)) {
			if (char === "\r" && peekChar(state, 1) !== "\n") {
				state.addDiagnostic(notes.expectedLfAfterCR);
			}

			scanSpace(state);
			return state.skipTrivia ? scan(state) : SyntaxKind.Space;
		} else if (terminatorRegexp.test(char)) {
			scanTerminator(state);
			return state.skipTrivia ? scan(state) : SyntaxKind.Terminator;
		} else if (char === ";") {
			scanComment(state);
			return state.skipTrivia ? scan(state) : SyntaxKind.Comment;
		} else if (char === ",") {
			nextChar(state);
			return SyntaxKind.Delimiter;
		} else if (intStartRegexp.test(char)) {
			scanInteger(state);
			const value = state.getLexeme();

			if (!isValidInteger(value)) {
				state.addDiagnostic(errors.malformedInteger(value));
			}

			return SyntaxKind.Integer;
		} else if (idStartRegexp.test(char)) {
			scanIdentifier(state);
			let kind: SyntaxKind;
			const id = state.getLexeme();
			const upperId = id.toUpperCase();

			if (i8085.isOpcodeName(upperId)) {
				kind = SyntaxKind.Opcode;
			} else if (i8085.isRegisterName(upperId)) {
				kind = SyntaxKind.Register;
			} else {
				kind = SyntaxKind.Identifier;
			}

			if (peekChar(state) === ":") {
				nextChar(state);

				if (kind !== SyntaxKind.Identifier) {
					state.addDiagnostic(errors.badLabelName(id));
				}

				kind = SyntaxKind.Label;
			}

			return kind;
		} else {
			nextChar(state);
			state.addDiagnostic(errors.unexpectedCharacter(char));
			return scan(state);
		}
	} else {
		if (!state.eofReached && !terminatorRegexp.test(state.source[state.source.length - 1])) {
			state.addDiagnostic(notes.expectedFinalNewline);
		}

		state.eofReached = true;
		return undefined;
	}
}

const spaceRegexp = / \t/;
const terminatorRegexp = /[\r\n]/;
const intStartRegexp = /[0-9]/;
const intConsumeRegexp = /[a-zA-Z0-9_]/;
const idStartRegexp = /[a-zA-Z_.]/;
const idPartRegexp = /[a-zA-Z0-9_.]/;

function scanSpace(state: Assembler): void {
	assert(spaceRegexp.test(peekChar(state) ?? ""));
	let char = nextChar(state);

	while (char && spaceRegexp.test(char)) {
		char = nextChar(state);
	}
}

function scanTerminator(state: Assembler): void {
	assert(terminatorRegexp.test(peekChar(state) ?? ""));
	let char = nextChar(state);

	while (char && terminatorRegexp.test(char)) {
		char = nextChar(state);
	}
}

function scanComment(state: Assembler): void {
	assert(peekChar(state) === ";");
	let char = nextChar(state);

	while (char && !terminatorRegexp.test(char)) {
		char = nextChar(state);
	}
}

function scanInteger(state: Assembler) {
	assert(intStartRegexp.test(peekChar(state) ?? ""));
	let char = nextChar(state);

	while (char && intConsumeRegexp.test(char)) {
		char = nextChar(state);
	}
}

function scanIdentifier(state: Assembler) {
	assert(idStartRegexp.test(peekChar(state) ?? ""));
	let char = nextChar(state);

	while (char && idPartRegexp.test(char)) {
		char = nextChar(state);
	}
}

function peekChar(state: Assembler, offset = 0): string | undefined {
	return state.source[state.position + offset];
}

function nextChar(state: Assembler) {
	const char = peekChar(state);
	assertIsDefined(char);
	state.position += 1;
	return peekChar(state);
}
