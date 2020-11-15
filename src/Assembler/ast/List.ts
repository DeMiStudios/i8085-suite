import type { Node } from "./Node";

const LIST_MARKER = Symbol("NodeList");

export interface List<TNode extends Node = Node> {
	[LIST_MARKER]: true;
	nodes: TNode[];
}

export function createList<TNode extends Node>(values: TNode[] = []): List<TNode> {
	return {
		[LIST_MARKER]: true,
		nodes: values
	};
}

export function isList(value: unknown): value is List {
	return value && typeof value === "object" && LIST_MARKER in value;
}
