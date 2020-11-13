export enum Operand {
	WordRegister,
	PairRegister,
	StaxRegister,
	PushRegister,
	RstValue,
	Address,
	Data8,
	Data16
}

export type WordRegisterName = keyof typeof WordRegister;
export enum WordRegister {
	B,
	C,
	D,
	E,
	H,
	L,
	M,
	A
}

export type PairRegisterName = keyof typeof PairRegister;
export enum PairRegister {
	/** BC */ B,
	/** DE */ D,
	/** HL */ H,
	/** SP */ SP
}

export type StaxRegisterName = keyof typeof StaxRegister;
export enum StaxRegister {
	/** BC */ B,
	/** DE */ D
}

export type PushRegisterName = keyof typeof PushRegister;
export enum PushRegister {
	/** BC */ B,
	/** DE */ D,
	/** HL */ H,
	/** AF */ PSW
}

export type RstValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type RegisterName = WordRegisterName | PairRegisterName | StaxRegisterName | PushRegisterName;

export function isRegisterName(name: string): name is RegisterName {
	return isWordRegisterName(name) || isPairRegisterName(name) || isStaxRegisterName(name) || isPushRegisterName(name);
}

export function isWordRegisterName(name: string): name is WordRegisterName {
	return name in WordRegister;
}

export function isPairRegisterName(name: string): name is PairRegisterName {
	return name in PairRegister;
}

export function isStaxRegisterName(name: string): name is StaxRegisterName {
	return name in StaxRegister;
}

export function isPushRegisterName(name: string): name is PushRegisterName {
	return name in PushRegister;
}

export function isRstValue(value: number): value is RstValue {
	return value % 1 === 0 && value >= 0 && value <= 7;
}

export function isValidAddress(value: number): boolean {
	return value % 1 === 0 && value >= 0 && value <= 65535;
}

export function isValidData8(value: number): boolean {
	return value % 1 === 0 && ((value >= 0 && value <= 255) || (value >= -128 && value <= 127));
}

export function isValidData16(value: number): boolean {
	return value % 1 === 0 && ((value >= 0 && value <= 65535) || (value >= -32768 && value <= 32767));
}

export function getOperandSize(operand: Operand): number {
	switch (operand) {
		case Operand.WordRegister:
		case Operand.PairRegister:
		case Operand.StaxRegister:
		case Operand.PushRegister:
		case Operand.RstValue:
			return 0;
		case Operand.Data8:
			return 1;
		case Operand.Address:
		case Operand.Data16:
			return 2;
	}
}
