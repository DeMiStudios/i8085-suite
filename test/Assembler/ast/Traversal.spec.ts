import ast from "Assembler/ast";
import { isInstruction, isLabel } from "Assembler/ast/Node";
import { SyntaxKind } from "Assembler/SyntaxKind";
import test from "ava";

const tree = ast.factory.Source({
	statements: ast.createList([
		ast.factory.Label({ name: ast.factory.Identifier({ text: "main" }) }),
		ast.factory.Instruction({
			target: ast.factory.Identifier({ text: "mov" }),
			operands: ast.createList([ast.factory.Identifier({ text: "a" }), ast.factory.Identifier({ text: "b" })])
		}),
		ast.factory.Instruction({
			target: ast.factory.Identifier({ text: "mvi" }),
			operands: ast.createList([ast.factory.Identifier({ text: "a" }), ast.factory.Integer({ value: 0x18 })])
		}),
		ast.factory.Instruction({
			target: ast.factory.Identifier({ text: "mvi" }),
			operands: ast.createList([ast.factory.Identifier({ text: "b" }), ast.factory.Integer({ value: 0xff })])
		})
	])
});

test("visit() and getChildren()", t => {
	const expected = [
		SyntaxKind.Source,
		// main:
		SyntaxKind.Label,
		SyntaxKind.Identifier,
		// mov a, b
		SyntaxKind.Instruction,
		SyntaxKind.Identifier,
		SyntaxKind.Identifier,
		SyntaxKind.Identifier,
		// mvi a, 18h
		SyntaxKind.Instruction,
		SyntaxKind.Identifier,
		SyntaxKind.Identifier,
		SyntaxKind.Integer,
		// mvi b, 0ffh
		SyntaxKind.Instruction,
		SyntaxKind.Identifier,
		SyntaxKind.Identifier,
		SyntaxKind.Integer
	];

	const visited: SyntaxKind[] = [];

	const visitor = (node: ast.Node) => {
		visited.push(node.kind);
		ast.getChildren(node).forEach(child => ast.visit(child, testVisitor));
	};

	const testVisitor: ast.Visitor = {
		visitSource: visitor,
		visitInstruction: visitor,
		visitLabel: visitor,
		visitIdentifier: visitor,
		visitInteger: visitor
	};

	ast.visit(tree, testVisitor);
	t.deepEqual(visited, expected);
});

test("getAncestor()", t => {
	const source = tree;
	const label = tree.statements.nodes[0] as ast.Label;
	t.is(ast.getAncestor(label, ast.isLabel), label);
	t.is(ast.getAncestor(label, ast.isSource), source);
	t.is(ast.getAncestor(label, isInstruction), undefined);

	const instruction = tree.statements.nodes[1] as ast.Instruction;
	t.is(ast.getAncestor(instruction, ast.isSource), source);
	t.is(ast.getAncestor(instruction, isLabel), undefined);

	const target = instruction.target;
	t.is(ast.getAncestor(target, ast.isInstruction), instruction);
	t.is(ast.getAncestor(target, ast.isStatement), instruction);
	t.is(ast.getAncestor(target, ast.isSource), source);
	t.is(ast.getAncestor(instruction, isLabel), undefined);
});
