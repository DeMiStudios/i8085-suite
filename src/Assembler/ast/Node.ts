import type { ExpressionKind, StatementKind } from "../SyntaxKind";
import { isExpressionKind, isStatementKind, SyntaxKind } from "../SyntaxKind";
import type { List } from "./List";
import { isList } from "./List";
import type { NodeByKind } from "./Mapping";

const NODE_MARKER = Symbol("Node");

export interface Node<T extends SyntaxKind = SyntaxKind> {
	[NODE_MARKER]: true;
	kind: T;
	parent?: Node | undefined;
	position: number;
	length: number;
}

export interface Source extends Node<SyntaxKind.Source> {
	parent: undefined;
	statements: List<Statement>;
}

export interface Statement<TStatement extends StatementKind = StatementKind> extends Node<TStatement> {
	parent: Source;
}

export interface Instruction extends Statement<SyntaxKind.Instruction> {
	target: Identifier;
	operands: List<Expression>;
}

export interface Label extends Statement<SyntaxKind.Label> {
	/** does not include ':' */
	name: Identifier;
}

export interface Expression<TExpression extends ExpressionKind = ExpressionKind> extends Node<TExpression> {
	parent: Statement | Expression;
}

export interface Identifier extends Expression<SyntaxKind.Identifier> {
	text: string;
}

export interface Integer extends Expression<SyntaxKind.Integer> {
	value: number;
}

export function isNode(value: unknown): value is Node {
	return value && typeof value === "object" && NODE_MARKER in value;
}

export function isSource(value: Node): value is Source {
	return value.kind === SyntaxKind.Source;
}

export function isStatement(value: Node): value is Statement {
	return isStatementKind(value.kind);
}

export function isInstruction(value: Node): value is Instruction {
	return value.kind === SyntaxKind.Instruction;
}

export function isLabel(value: Node): value is Label {
	return value.kind === SyntaxKind.Label;
}
export function isExpression(value: Node): value is Expression {
	return isExpressionKind(value.kind);
}

export function isIdentifier(value: Node): value is Identifier {
	return value.kind === SyntaxKind.Identifier;
}

export function isInteger(value: Node): value is Integer {
	return value.kind === SyntaxKind.Integer;
}

export function createNode<T extends keyof NodeByKind>(
	kind: T,
	fields: Omit<NodeByKind[T], typeof NODE_MARKER | "kind" | "parent">
): NodeByKind[T] {
	const node: NodeByKind[T] = { [NODE_MARKER]: true, kind, parent: undefined as never, ...fields } as never;

	for (const value of Object.values(node)) {
		if (isNode(value)) {
			value.parent = node;
		} else if (isList(value)) {
			value.nodes.forEach(child => (child.parent = node));
		}
	}

	return node;
}
