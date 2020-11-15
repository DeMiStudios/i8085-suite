import { SyntaxKind } from "Assembler/SyntaxKind";
import ast from ".";
import type { NodeByKind } from "./Mapping";

export const factory: {
	readonly [K in SyntaxKindNames]: (
		fields: Omit<NodeByKind[typeof SyntaxKind[K]], keyof ast.Node | "parent">
	) => NodeByKind[typeof SyntaxKind[K]];
} = {
	Source: fields => ast.createNode(SyntaxKind.Source, { position: 0, length: 0, ...fields }),
	Instruction: fields => ast.createNode(SyntaxKind.Instruction, { position: 0, length: 0, ...fields }),
	Label: fields => ast.createNode(SyntaxKind.Label, { position: 0, length: 0, ...fields }),
	Identifier: fields => ast.createNode(SyntaxKind.Identifier, { position: 0, length: 0, ...fields }),
	Integer: fields => ast.createNode(SyntaxKind.Integer, { position: 0, length: 0, ...fields })
};

type SyntaxKindNames = keyof typeof SyntaxKind;
