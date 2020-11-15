import type { AssemblerState } from "./AssemblerState";
import { errors, notes } from "./Diagnostics";
import { TokenKind } from "./TokenKind";
import { isValidInteger } from "./utility/Integer";

export function scan(state: AssemblerState): TokenKind {
	const char = state.source[state.position];
	state.lastPosition = state.position;

	if (char) {
		if (char in punctuators) {
			++state.position;
			state.token = punctuators[char];
		} else if (spaceRegexp.test(char)) {
			scanSpace(state);
			state.token = TokenKind.Space;
		} else if (terminatorRegexp.test(char)) {
			scanTerminator(state);
			state.token = TokenKind.Terminator;
		} else if (char === ";") {
			scanComment(state);
			state.token = TokenKind.Comment;
		} else if (intStartRegexp.test(char)) {
			scanInteger(state);
			state.token = TokenKind.Integer;
			return TokenKind.Integer;
		} else if (idStartRegexp.test(char)) {
			scanIdentifier(state);
			state.token = TokenKind.Identifier;
		} else {
			state.position += 1;
			state.addDiagnostic(errors.unexpectedCharacter(char));
			return scan(state);
		}
	} else {
		if (!state.eofReached && !terminatorRegexp.test(state.source[state.source.length - 1])) {
			state.addDiagnostic(notes.expectedFinalNewline);
		}

		state.token = TokenKind.EndOfFile;
		state.eofReached = true;
	}

	return state.token;
}

const punctuators: { readonly [index: string]: TokenKind } = {
	",": TokenKind.Delimiter,
	":": TokenKind.Colon
} as const;

const spaceRegexp = /[ \t]/;
const terminatorRegexp = /[\r\n]/;
const idStartRegexp = /[a-zA-Z_.]/;
const idPartRegexp = /[a-zA-Z0-9_.]/;
const intStartRegexp = /[0-9]/;
const intConsumeRegexp = /[a-zA-Z0-9_]/;

function scanSpace(state: AssemblerState): void {
	let char = state.source[++state.position];

	while (char && spaceRegexp.test(char)) {
		char = state.source[++state.position];
	}
}

function scanTerminator(state: AssemblerState): void {
	if (state.source[state.position] === "\r") {
		++state.position;

		if (state.source[state.position] !== "\n") {
			state.addDiagnostic(notes.expectedLfAfterCR);
		} else {
			++state.position;
		}
	} else {
		++state.position;
	}
}

function scanComment(state: AssemblerState): void {
	let char = state.source[++state.position];

	while (char && !terminatorRegexp.test(char)) {
		char = state.source[++state.position];
	}
}

function scanIdentifier(state: AssemblerState) {
	let char = state.source[++state.position];

	while (char && idPartRegexp.test(char)) {
		char = state.source[++state.position];
	}
}

function scanInteger(state: AssemblerState) {
	let char = state.source[++state.position];

	while (char && intConsumeRegexp.test(char)) {
		char = state.source[++state.position];
	}

	if (!isValidInteger(state.getTokenLexeme())) {
		state.addDiagnostic(errors.malformedInteger(state.getTokenLexeme()));
	}
}
