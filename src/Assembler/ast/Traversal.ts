import ast from ".";

export interface Visitor<TReturn = void> {
	visitSource(source: ast.Source): TReturn;
	visitInstruction(instruction: ast.Instruction): TReturn;
	visitLabel(label: ast.Label): TReturn;
	visitIdentifier(identifier: ast.Identifier): TReturn;
	visitInteger(integer: ast.Integer): TReturn;
}

export function visit<TReturn>(node: ast.Node, visitor: Visitor<TReturn>): TReturn {
	/* istanbul ignore else */
	if (ast.isSource(node)) return visitor.visitSource(node);
	else if (ast.isInstruction(node)) return visitor.visitInstruction(node);
	else if (ast.isLabel(node)) return visitor.visitLabel(node);
	else if (ast.isIdentifier(node)) return visitor.visitIdentifier(node);
	else if (ast.isInteger(node)) return visitor.visitInteger(node);
	else throw new Error("unknown error");
}

export function getChildren(node: ast.Node): ast.Node[] {
	/* istanbul ignore else */
	if (ast.isSource(node)) return [...node.statements.nodes];
	else if (ast.isInstruction(node)) return [node.target, ...node.operands.nodes];
	else if (ast.isLabel(node)) return [node.name];
	else if (ast.isIdentifier(node)) return [];
	else if (ast.isInteger(node)) return [];
	else throw new Error("unknown error");
}

export function getAncestor<T extends ast.Node>(node: ast.Node, check: (value: ast.Node) => value is T): T | undefined {
	let current: ast.Node | undefined = node;

	while (current && !check(current)) {
		current = current.parent;
	}

	return current;
}
