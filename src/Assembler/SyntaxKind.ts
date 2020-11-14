export enum SyntaxKind {
	Source,

	// Trivia
	Space,
	Terminator,
	Comment,

	// Statement
	Instruction,
	Label,

	// Expression
	Register,
	Integer,
	Identifier,

	// Miscellaneous
	Opcode,
	Delimiter
}

export type TriviaKind = SyntaxKind.Space | SyntaxKind.Terminator | SyntaxKind.Comment;
export type StatementKind = SyntaxKind.Instruction | SyntaxKind.Label;
export type ExpressionKind = SyntaxKind.Register | SyntaxKind.Integer | SyntaxKind.Identifier;

export function isTriviaKind(kind: SyntaxKind): kind is TriviaKind {
	return kind === SyntaxKind.Space || kind === SyntaxKind.Terminator || kind === SyntaxKind.Comment;
}

export function isStatementKind(kind: SyntaxKind): kind is StatementKind {
	return kind === SyntaxKind.Instruction || kind === SyntaxKind.Label;
}

export function isExpressionKind(kind: SyntaxKind): kind is ExpressionKind {
	return kind === SyntaxKind.Register || kind === SyntaxKind.Integer || kind === SyntaxKind.Identifier;
}
