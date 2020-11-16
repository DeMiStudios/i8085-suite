import { SyntaxKind } from "Assembler/SyntaxKind";
import type ast from ".";

export interface Visitor<TReturn = void> {
	visitSource(source: ast.Source): TReturn;
	visitInstruction(instruction: ast.Instruction): TReturn;
	visitLabel(label: ast.Label): TReturn;
	visitIdentifier(identifier: ast.Identifier): TReturn;
	visitInteger(integer: ast.Integer): TReturn;
}

export function visit<TReturn>(node: ast.Node, visitor: Visitor<TReturn>): TReturn {
	switch (node.kind) {
		case SyntaxKind.Source:
			return visitor.visitSource(node as ast.Source);
		case SyntaxKind.Instruction:
			return visitor.visitInstruction(node as ast.Instruction);
		case SyntaxKind.Label:
			return visitor.visitLabel(node as ast.Label);
		case SyntaxKind.Identifier:
			return visitor.visitIdentifier(node as ast.Identifier);
		case SyntaxKind.Integer:
			return visitor.visitInteger(node as ast.Integer);
	}
}

export function getChildren(node: ast.Node): ast.Node[] {
	switch (node.kind) {
		case SyntaxKind.Source:
			return [...(node as ast.Source).statements.nodes];
		case SyntaxKind.Instruction:
			return [(node as ast.Instruction).target, ...(node as ast.Instruction).operands.nodes];
		case SyntaxKind.Label:
			return [(node as ast.Label).name];
		case SyntaxKind.Identifier:
		case SyntaxKind.Integer:
			return [];
	}
}

export function getAncestor<T extends ast.Node>(node: ast.Node, check: (value: ast.Node) => value is T): T | undefined {
	let current: ast.Node | undefined = node;

	while (current && !check(current)) {
		current = current.parent;
	}

	return current;
}
