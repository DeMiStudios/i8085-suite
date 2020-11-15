import type { Node } from "./Node";

const LIST_MARKER = Symbol("NodeList");

export interface List<T extends Node = Node> {
	[LIST_MARKER]: true;
	nodes: T[];
}

export function createList<T extends Node>(values: T[] = []): List<T> {
	return {
		[LIST_MARKER]: true,
		nodes: values
	};
}

export function isList(value: unknown): value is List {
	return value && typeof value === "object" && LIST_MARKER in value;
}
