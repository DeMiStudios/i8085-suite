import { AssemblerState } from "Assembler/AssemblerState";
import ast from "Assembler/ast";
import { errors } from "Assembler/Diagnostics";
import { parse } from "Assembler/Parser";
import { SyntaxKind } from "Assembler/SyntaxKind";
import { TokenKind } from "Assembler/TokenKind";
import test from "ava";
import type { Diagnostic } from "Shared/Diagnostic";

test("parse() - no diagnostics", t => {
	const source = "\nlabel: ; comment\nmvi a, 123 \n";
	const state = new AssemblerState("test", { source });

	const expected: ast.Source = ast.createNode(SyntaxKind.Source, {
		position: 0,
		length: source.length,
		statements: ast.createList([
			ast.createNode(SyntaxKind.Label, {
				position: 1,
				length: 6,
				name: ast.createNode(SyntaxKind.Identifier, {
					position: 1,
					length: 5,
					text: "label"
				})
			}),
			ast.createNode(SyntaxKind.Instruction, {
				position: 18,
				length: 10,
				target: ast.createNode(SyntaxKind.Identifier, {
					position: 18,
					length: 3,
					text: "mvi"
				}),
				operands: ast.createList([
					ast.createNode(SyntaxKind.Identifier, {
						position: 22,
						length: 1,
						text: "a"
					}),
					ast.createNode(SyntaxKind.Integer, {
						position: 25,
						length: 3,
						value: 123
					})
				])
			})
		])
	});

	t.deepEqual(parse(state), expected);
});

test("parse() - with diagnostics", t => {
	const source = "nop\nmvi ,\n:\nmov a ,\n";
	const state = new AssemblerState("test", { source, debug: true });
	const tree = parse(state);

	const diagnostics: readonly Diagnostic[] = [
		errors.expectedExpression(TokenKind.Delimiter)("test", 8, 1),
		errors.expectedStatement(TokenKind.Colon)("test", 10, 1),
		errors.expectedExpression(TokenKind.Terminator)("test", 19, 1)
	];

	t.deepEqual(state.diagnostics, diagnostics);

	t.deepEqual(
		tree,
		ast.createNode(SyntaxKind.Source, {
			position: 0,
			length: source.length,
			statements: ast.createList([
				ast.createNode(SyntaxKind.Instruction, {
					position: 0,
					length: 3,
					target: ast.createNode(SyntaxKind.Identifier, {
						position: 0,
						length: 3,
						text: "nop"
					}),
					operands: ast.createList()
				}),
				ast.createNode(SyntaxKind.Instruction, {
					position: 4,
					length: 3,
					target: ast.createNode(SyntaxKind.Identifier, {
						position: 4,
						length: 3,
						text: "mvi"
					}),
					operands: ast.createList()
				}),
				ast.createNode(SyntaxKind.Instruction, {
					position: 12,
					length: 5,
					target: ast.createNode(SyntaxKind.Identifier, {
						position: 12,
						length: 3,
						text: "mov"
					}),
					operands: ast.createList([
						ast.createNode(SyntaxKind.Identifier, {
							position: 16,
							length: 1,
							text: "a"
						})
					])
				})
			])
		})
	);
});
