import type ast from ".";
import { SyntaxKind } from "../SyntaxKind";

export interface NodeByKind {
	[SyntaxKind.Source]: ast.Source;
	[SyntaxKind.Instruction]: ast.Instruction;
	[SyntaxKind.Label]: ast.Label;
	[SyntaxKind.Identifier]: ast.Identifier;
	[SyntaxKind.Integer]: ast.Integer;
}
