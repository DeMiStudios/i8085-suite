import ast from "Assembler/ast";
import { isExpressionKind, isStatementKind, SyntaxKind } from "Assembler/SyntaxKind";
import type { ExecutionContext } from "ava";
import test, { before } from "ava";

let nodes: { [K in SyntaxKind]: ast.NodeByKind[K] };

before("createNode()", () => {
	nodes = {
		[SyntaxKind.Source]: ast.createNode(SyntaxKind.Source, {
			position: 0,
			length: 0,
			statements: ast.createList()
		}),
		[SyntaxKind.Instruction]: ast.createNode(SyntaxKind.Instruction, {
			position: 0,
			length: 0,
			target: ast.createNode(SyntaxKind.Identifier, { position: 0, length: 0, text: "" }),
			operands: ast.createList()
		}),
		[SyntaxKind.Label]: ast.createNode(SyntaxKind.Label, {
			position: 0,
			length: 0,
			name: ast.createNode(SyntaxKind.Identifier, { position: 0, length: 0, text: "" })
		}),
		[SyntaxKind.Identifier]: ast.createNode(SyntaxKind.Identifier, { position: 0, length: 0, text: "" }),
		[SyntaxKind.Integer]: ast.createNode(SyntaxKind.Integer, { position: 0, length: 0, value: 0 })
	};
});

const helper = <T extends ast.Node>(
	t: ExecutionContext,
	typeGuard: (value: ast.Node) => value is T,
	expected: (value: ast.Node) => value is T
) => Object.values(nodes).forEach(node => t.is(typeGuard(node), expected(node)));

test("isNode()", t => {
	Object.values(nodes).forEach(node => t.true(ast.isNode(node)));
	t.false(ast.isNode({}));
});

test("isSource()", t =>
	helper(t, ast.isSource, (value: ast.Node): value is ast.Source => value.kind === SyntaxKind.Source));

test("isStatement()", t =>
	helper(t, ast.isStatement, (value: ast.Node): value is ast.Statement => isStatementKind(value.kind)));

test("isInstruction()", t =>
	helper(t, ast.isInstruction, (value: ast.Node): value is ast.Instruction => value.kind === SyntaxKind.Instruction));

test("isLabel()", t =>
	helper(t, ast.isLabel, (value: ast.Node): value is ast.Label => value.kind === SyntaxKind.Label));

test("isExpression()", t =>
	helper(t, ast.isExpression, (value: ast.Node): value is ast.Expression => isExpressionKind(value.kind)));

test("isIdentifier()", t =>
	helper(t, ast.isIdentifier, (value: ast.Node): value is ast.Identifier => value.kind === SyntaxKind.Identifier));

test("isInteger()", t =>
	helper(t, ast.isInteger, (value: ast.Node): value is ast.Integer => value.kind === SyntaxKind.Integer));
