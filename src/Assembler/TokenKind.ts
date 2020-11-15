export enum TokenKind {
	EndOfFile,

	// Trivia
	Space,
	Terminator,
	Comment,

	// Literals
	Identifier,
	Integer,

	// Punctuators
	Delimiter,
	Colon
}

export type TriviaTokenKind = TokenKind.Space | TokenKind.Terminator | TokenKind.Comment;
export type LiteralTokenKind = TokenKind.Identifier | TokenKind.Integer;
export type PunctuatorTokenKind = TokenKind.Delimiter | TokenKind.Colon;

export function isTriviaTokenKind(kind: TokenKind): kind is TriviaTokenKind {
	return kind === TokenKind.Space || kind === TokenKind.Terminator || kind === TokenKind.Comment;
}

export function isLiteralTokenKind(kind: TokenKind): kind is LiteralTokenKind {
	return kind === TokenKind.Identifier || kind === TokenKind.Integer;
}

export function isPunctuatorTokenKind(kind: TokenKind): kind is PunctuatorTokenKind {
	return kind === TokenKind.Delimiter || kind === TokenKind.Colon;
}
