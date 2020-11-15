import type { AssemblerState } from "./AssemblerState";
import ast from "./ast";
import { errors } from "./Diagnostics";
import { scan } from "./Scanner";
import { SyntaxKind } from "./SyntaxKind";
import { isTriviaTokenKind, TokenKind } from "./TokenKind";
import * as integer from "./utility/Integer";

export function parse(state: AssemblerState): ast.Source {
	scan(state);
	const tree = parseSource(state);
	state.tree = tree;
	return tree;
}

function skipSpace(state: AssemblerState) {
	while (state.getToken() === TokenKind.Space) {
		scan(state);
	}
}

function skipTrivia(state: AssemblerState) {
	while (isTriviaTokenKind(state.getToken())) {
		scan(state);
	}
}

function skipLine(state: AssemblerState) {
	while (state.getToken() !== TokenKind.EndOfFile && state.getToken() !== TokenKind.Terminator) {
		scan(state);
	}

	scan(state); // skip Terminator
}

function parseSource(state: AssemblerState): ast.Source {
	const position = state.getTokenPosition();
	const statements: ast.Statement[] = [];
	skipTrivia(state);

	while (state.getToken() !== TokenKind.EndOfFile) {
		if (isStatementStart(state.getToken())) {
			const node = parseStatement(state);
			statements.push(node);
		} else {
			state.addDiagnostic(errors.expectedStatement(state.getToken()));
			skipLine(state);
		}

		skipTrivia(state);
	}

	scan(state); // skip EndOfFile

	return ast.createNode(SyntaxKind.Source, {
		position: position,
		length: state.getTokenPosition() - position,
		statements: ast.createList(statements)
	});
}

function parseStatement(state: AssemblerState): ast.Statement {
	const identifier = parseIdentifier(state);
	let length = state.getTokenPosition() - identifier.position;
	skipSpace(state);

	if (state.getToken() === TokenKind.Colon) {
		// Label
		scan(state);

		return ast.createNode(SyntaxKind.Label, {
			position: identifier.position,
			length: state.getTokenPosition() - identifier.position,
			name: identifier
		});
	} else {
		// Instruction
		const operands: ast.Expression[] = [];
		let failure = false;

		if (state.getToken() !== TokenKind.EndOfFile && !isTriviaTokenKind(state.getToken())) {
			if (isExpressionStart(state.getToken())) {
				operands.push(parseExpression(state));
				length = state.getTokenPosition() - identifier.position;
				skipSpace(state);

				while (state.getToken() === TokenKind.Delimiter) {
					scan(state);
					skipSpace(state);

					if (isExpressionStart(state.getToken())) {
						operands.push(parseExpression(state));
						length = state.getTokenPosition() - identifier.position;
						skipSpace(state);
					} else {
						state.addDiagnostic(errors.expectedExpression(state.getToken()));
						failure = true;
						break;
					}
				}
			} else {
				state.addDiagnostic(errors.expectedExpression(state.getToken()));
				failure = true;
			}
		}

		if (!failure) {
			if (state.getToken() === TokenKind.Comment) {
				scan(state);
			}

			if (state.getToken() === TokenKind.Terminator) {
				scan(state);
			}
		} else {
			skipLine(state);
		}

		return ast.createNode(SyntaxKind.Instruction, {
			position: identifier.position,
			length: length,
			target: identifier,
			operands: ast.createList(operands)
		});
	}
}

function parseIdentifier(state: AssemblerState): ast.Identifier {
	const node = ast.createNode(SyntaxKind.Identifier, {
		position: state.getTokenPosition(),
		length: state.getTokenLength(),
		text: state.getTokenLexeme()
	});

	scan(state);
	return node;
}

function parseInteger(state: AssemblerState): ast.Integer {
	const node = ast.createNode(SyntaxKind.Integer, {
		position: state.getTokenPosition(),
		length: state.getTokenLength(),
		value: integer.parseInteger(state.getTokenLexeme()) ?? 0
	});

	scan(state);
	return node;
}

function parseExpression(state: AssemblerState): ast.Expression {
	if (state.getToken() === TokenKind.Identifier) {
		return parseIdentifier(state);
	} else {
		return parseInteger(state);
	}
}

function isStatementStart(kind: TokenKind): kind is TokenKind.Identifier {
	return kind === TokenKind.Identifier;
}

function isExpressionStart(kind: TokenKind): kind is TokenKind.Identifier | TokenKind.Integer {
	return kind === TokenKind.Identifier || kind === TokenKind.Integer;
}
