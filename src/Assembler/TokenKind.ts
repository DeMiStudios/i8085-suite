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

export type TriviaKind = TokenKind.Space | TokenKind.Terminator | TokenKind.Comment;
export type LiteralKind = TokenKind.Identifier | TokenKind.Integer;
export type PunctuatorKind = TokenKind.Delimiter | TokenKind.Colon;

export function isTriviaKind(kind: TokenKind): kind is TriviaKind {
	return kind === TokenKind.Space || kind === TokenKind.Terminator || kind === TokenKind.Comment;
}

export function isLiteralKind(kind: TokenKind): kind is LiteralKind {
	return kind === TokenKind.Identifier || kind === TokenKind.Integer;
}

export function isPunctuatorKind(kind: TokenKind): kind is PunctuatorKind {
	return kind === TokenKind.Delimiter || kind === TokenKind.Colon;
}
