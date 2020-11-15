export enum SyntaxKind {
	Source,

	// Statement
	Instruction,
	Label,

	// Expression
	Identifier,
	Integer
}

export type StatementKind = SyntaxKind.Instruction | SyntaxKind.Label;
export type ExpressionKind = SyntaxKind.Identifier | SyntaxKind.Integer;

export function isStatementKind(kind: SyntaxKind): kind is StatementKind {
	return kind === SyntaxKind.Instruction || kind === SyntaxKind.Label;
}

export function isExpressionKind(kind: SyntaxKind): kind is ExpressionKind {
	return kind === SyntaxKind.Identifier || kind === SyntaxKind.Integer;
}
