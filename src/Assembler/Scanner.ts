import i8085 from "Shared/i8085";
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
			return SyntaxKind.Integer;
		} else if (idStartRegexp.test(char)) {
			scanIdentifier(state);
			let kind: SyntaxKind;
			const id = state.getLexeme();

			if (i8085.isOpcodeName(id.toUpperCase())) {
				kind = SyntaxKind.Opcode;
			} else if (i8085.isRegisterName(id.toUpperCase())) {
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

const spaceRegexp = /[ \t]/;
const terminatorRegexp = /[\r\n]/;
const intStartRegexp = /[0-9]/;
const intConsumeRegexp = /[a-zA-Z0-9_]/;
const idStartRegexp = /[a-zA-Z_.]/;
const idPartRegexp = /[a-zA-Z0-9_.]/;

function scanSpace(state: Assembler): void {
	let char = nextChar(state);

	while (char && spaceRegexp.test(char)) {
		char = nextChar(state);
	}
}

function scanTerminator(state: Assembler): void {
	if (peekChar(state) === "\r") {
		nextChar(state);

		if (peekChar(state) !== "\n") {
			state.addDiagnostic(notes.expectedLfAfterCR);
		} else {
			nextChar(state);
		}
	} else {
		nextChar(state);
	}
}

function scanComment(state: Assembler): void {
	let char = nextChar(state);

	while (char && !terminatorRegexp.test(char)) {
		char = nextChar(state);
	}
}

function scanInteger(state: Assembler) {
	let char = nextChar(state);

	while (char && intConsumeRegexp.test(char)) {
		char = nextChar(state);
	}

	if (!isValidInteger(state.getLexeme())) {
		state.addDiagnostic(errors.malformedInteger(state.getLexeme()));
	}
}

function scanIdentifier(state: Assembler) {
	let char = nextChar(state);

	while (char && idPartRegexp.test(char)) {
		char = nextChar(state);
	}
}

function peekChar(state: Assembler, offset = 0): string | undefined {
	return state.source[state.position + offset];
}

function nextChar(state: Assembler) {
	state.position += 1;
	return peekChar(state);
}
