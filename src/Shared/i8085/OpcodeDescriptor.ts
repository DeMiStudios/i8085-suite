import type { Flag } from "./Flag";
import type { Format } from "./Format";
import type { Group } from "./Group";
import type { Opcode } from "./Opcode";

export interface OpcodeDescriptor {
	readonly group: Group;
	readonly opcode: Opcode;
	readonly format: Format;
	readonly origin: number;
	readonly flags: readonly Flag[];
	readonly duration: number | readonly [Base: number, Condition: number];
}
