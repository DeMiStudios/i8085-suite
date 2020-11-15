import type { AssemblerState } from "./AssemblerState";
import ast from "./ast";
import { errors } from "./Diagnostics";
import { scan } from "./Scanner";
import { SyntaxKind } from "./SyntaxKind";
import { isTriviaKind, TokenKind } from "./TokenKind";
import * as integer from "./utility/Integer";

export function parse(state: AssemblerState): ast.Source {
	scan(state);
	const tree = parseSource(state);
	state.tree = tree;
	return tree;
}

function expect(state: AssemblerState, kind: TokenKind) {
	if (state.getToken() !== kind) {
		state.addDiagnostic(errors.expectedToken(kind, state.getToken()));
	} else {
		scan(state);
	}
}

function skipSpace(state: AssemblerState) {
	while (state.getToken() === TokenKind.Space) {
		scan(state);
	}
}

function skipTrivia(state: AssemblerState) {
	while (isTriviaKind(state.getToken())) {
		scan(state);
	}
}

function parseSource(state: AssemblerState): ast.Source {
	const position = state.getTokenPosition();
	const statements: ast.Statement[] = [];
	skipTrivia(state);

	while (isStatementStart(state.getToken())) {
		const node = parseStatement(state);
		statements.push(node);
		skipTrivia(state);
	}

	expect(state, TokenKind.EndOfFile);

	return ast.createNode(SyntaxKind.Source, {
		position: position,
		length: state.getTokenPosition() - position,
		statements: ast.createList(statements)
	});
}

function parseStatement(state: AssemblerState): ast.Statement {
	const identifier = parseIdentifier(state);
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
		const operands = parseOperands(state);

		if (state.getToken() === TokenKind.Comment) {
			scan(state);
		}

		if (state.getToken() !== TokenKind.EndOfFile) {
			expect(state, TokenKind.Terminator);
		}

		return ast.createNode(SyntaxKind.Instruction, {
			position: identifier.position,
			length: state.getTokenPosition() - identifier.position,
			target: identifier,
			operands: operands
		});
	}
}

function parseOperands(state: AssemblerState): ast.List<ast.Expression> {
	const operands: ast.Expression[] = [];

	if (isExpressionStart(state.getToken())) {
		operands.push(parseExpression(state));
		skipSpace(state);

		while (state.getToken() === TokenKind.Delimiter) {
			scan(state);
			skipSpace(state);
			operands.push(parseExpression(state));
			skipSpace(state);
		}
	}

	return ast.createList(operands);
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
