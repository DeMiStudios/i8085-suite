import { AssertionError } from "assert";

export function assert(condition: unknown, message?: string): asserts condition {
	if (!condition) {
		throw new AssertionError({ message });
	}
}

export function assertIsDefined<T>(value: T, message?: string): asserts value is NonNullable<T> {
	if (value === undefined || value === null) {
		throw new AssertionError({ message });
	}
}
