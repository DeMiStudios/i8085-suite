import ast from "..";

export class AstPrinter implements ast.Visitor<string> {
	public visitSource(source: ast.Source): string {
		return ast.getChildren(source).reduce((code, node) => `${code}${ast.visit(node, this)}\n`, "");
	}

	public visitInstruction(instruction: ast.Instruction): string {
		return (
			`${this.visitIdentifier(instruction.target)} ` +
			instruction.operands.nodes.map(node => ast.visit(node, this)).join(", ")
		);
	}

	public visitLabel(label: ast.Label): string {
		return `${this.visitIdentifier(label.name)}:`;
	}

	public visitIdentifier(identifier: ast.Identifier): string {
		return identifier.text;
	}

	public visitInteger(integer: ast.Integer): string {
		const text = integer.value.toString(16);
		return /[0-9]/.test(text[0]) ? `${text}h` : `0${text}h`;
	}
}
