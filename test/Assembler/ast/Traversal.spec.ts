import ast from "Assembler/ast";
import { factory } from "Assembler/ast/Factory";
import { isInstruction, isLabel } from "Assembler/ast/Node";
import { SyntaxKind } from "Assembler/SyntaxKind";
import test from "ava";

const tree = factory.Source({
	statements: ast.createList([
		factory.Label({ name: factory.Identifier({ text: "main" }) }),
		factory.Instruction({
			target: factory.Identifier({ text: "mov" }),
			operands: ast.createList([factory.Identifier({ text: "a" }), factory.Identifier({ text: "b" })])
		}),
		factory.Instruction({
			target: factory.Identifier({ text: "mvi" }),
			operands: ast.createList([factory.Identifier({ text: "a" }), factory.Integer({ value: 0x18 })])
		}),
		factory.Instruction({
			target: factory.Identifier({ text: "mvi" }),
			operands: ast.createList([factory.Identifier({ text: "b" }), factory.Integer({ value: 0xff })])
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
