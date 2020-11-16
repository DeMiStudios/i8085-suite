import ast from "Assembler/ast";
import test from "ava";

test("AstPrinter", t => {
	const printer = new ast.visitors.AstPrinter();

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

	t.is(ast.visit(tree, printer), "main:\nmov a, b\nmvi a, 18h\nmvi b, 0ffh\n");
});
