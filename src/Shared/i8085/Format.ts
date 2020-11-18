import { getOperandSize, Operand } from "./Operand";

export enum Format {
	// 0 operands
	NoOperands,

	// 1 operand
	WordRegister,
	PairRegister,
	StaxRegister,
	PushRegister,
	RstValue,
	Address,
	Data8,

	// 2 operands
	TwoWordRegisters,
	WordRegisterAndData8,
	PairRegisterAndData16
}

export type ZeroOperandFormat = Format.NoOperands;

export type OneOperandFormat =
	| Format.WordRegister
	| Format.PairRegister
	| Format.StaxRegister
	| Format.PushRegister
	| Format.RstValue
	| Format.Address
	| Format.Data8;

export type TwoOperandFormat = Format.TwoWordRegisters | Format.WordRegisterAndData8 | Format.PairRegisterAndData16;

export function isZeroOperandFormat(format: Format): format is ZeroOperandFormat {
	return format === Format.NoOperands;
}

export function isOneOperandFormat(format: Format): format is OneOperandFormat {
	return (
		format === Format.WordRegister ||
		format === Format.PairRegister ||
		format === Format.StaxRegister ||
		format === Format.PushRegister ||
		format === Format.RstValue ||
		format === Format.Address ||
		format === Format.Data8
	);
}

export function isTwoOperandFormat(format: Format): format is TwoOperandFormat {
	return (
		format === Format.TwoWordRegisters ||
		format === Format.WordRegisterAndData8 ||
		format === Format.PairRegisterAndData16
	);
}

export function getInstructionOperands(format: Format): readonly Operand[] {
	return operandTable[format];
}

export function getInstructionSize(format: Format): number {
	return operandTable[format].reduce((size, operand) => size + getOperandSize(operand), 1);
}

const operandTable: { readonly [K in Format]: readonly Operand[] } = {
	[Format.NoOperands]: [],
	[Format.WordRegister]: [Operand.WordRegister],
	[Format.PairRegister]: [Operand.PairRegister],
	[Format.StaxRegister]: [Operand.StaxRegister],
	[Format.PushRegister]: [Operand.PushRegister],
	[Format.RstValue]: [Operand.RstValue],
	[Format.Address]: [Operand.Address],
	[Format.Data8]: [Operand.Data8],
	[Format.TwoWordRegisters]: [Operand.WordRegister, Operand.WordRegister],
	[Format.WordRegisterAndData8]: [Operand.WordRegister, Operand.Data8],
	[Format.PairRegisterAndData16]: [Operand.PairRegister, Operand.Data16]
};
