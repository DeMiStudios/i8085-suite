import { Flag } from "./Flag";
import { Format } from "./Format";
import { Group } from "./Group";
import type { OpcodeDescriptor } from "./OpcodeDescriptor";

export type OpcodeName = keyof typeof Opcode;
export enum Opcode {
	/** add immediate with carry */ ACI,
	/** add with carry */ ADC,
	/** add */ ADD,
	/** add immediate */ ADI,
	/** logical and with accumulator */ ANA,
	/** and immediate with accumulator */ ANI,
	/** call */ CALL,
	/** call if carry */ CC,
	/** call if minus */ CM,
	/** complement accumulator */ CMA,
	/** complement carry */ CMC,
	/** compare with accumulator */ CMP,
	/** call if no carry */ CNC,
	/** call if not zero */ CNZ,
	/** call if positive */ CP,
	/** call if parity even */ CPE,
	/** compare immediate */ CPI,
	/** call if parity odd */ CPO,
	/** call if zero */ CZ,
	/** decimal adjust accumulator */ DAA,
	/** double register add */ DAD,
	/** decrement */ DCR,
	/** decrement register pair */ DCX,
	/** disable interrupts */ DI,
	/** enable interrupts */ EI,
	/** halt */ HLT,
	/** input from port */ IN,
	/** increment */ INR,
	/** increment register pair */ INX,
	/** jump if carry */ JC,
	/** jump if minus */ JM,
	/** jump */ JMP,
	/** jump if no carry */ JNC,
	/** jump if not zero */ JNZ,
	/** jump if positive */ JP,
	/** jump if parity even */ JPE,
	/** jump if parity odd */ JPO,
	/** jump if zero */ JZ,
	/** load accumulator direct */ LDA,
	/** load accumulator indirect */ LDAX,
	/** load HL direct */ LHLD,
	/** load register pair immediate */ LXI,
	/** move */ MOV,
	/** move immediate */ MVI,
	/** no operation */ NOP,
	/** inclusive or with accumulator */ ORA,
	/** inclusive or immediate with accumulator */ ORI,
	/** output to port */ OUT,
	/** move HL to program counter */ PCHL,
	/** pop */ POP,
	/** push */ PUSH,
	/** rotate left through carry */ RAL,
	/** rotate right through carry */ RAR,
	/** return if carry */ RC,
	/** return from subroutine */ RET,
	/** read interrupt mask */ RIM,
	/** rotate accumulator left */ RLC,
	/** return if minus */ RM,
	/** return if no carry */ RNC,
	/** return if not zero */ RNZ,
	/** return if positive */ RP,
	/** return if parity even */ RPE,
	/** return if parity odd */ RPO,
	/** rotate accumulator right */ RRC,
	/** restart */ RST,
	/** return if zero */ RZ,
	/** subtract with borrow */ SBB,
	/** subtract immediate with borrow */ SBI,
	/** store HL direct */ SHLD,
	/** set interrupt mask */ SIM,
	/** move HL to SP */ SPHL,
	/** store accumulator direct */ STA,
	/** store accumulator indirect */ STAX,
	/** set carry */ STC,
	/** subtract */ SUB,
	/** subtract immediate */ SUI,
	/** exchange HL with DE */ XCHG,
	/** exclusive or with accumulator */ XRA,
	/** exclusive or immediate with accumulator */ XRI,
	/** exchange HL with top of stack */ XTHL
}

export function isOpcodeName(name: string): name is OpcodeName {
	return name in Opcode;
}

export function getOpcodeDescriptor(opcode: Opcode): OpcodeDescriptor {
	return descriptorTable[opcode];
}

export function getOpcodeFromByte(byte: number): Opcode | undefined {
	return opcodeTable[byte];
}

const noFlags = [] as const;
const cyFlag = [Flag.CY] as const;
const nonCyFlags = [Flag.P, Flag.AC, Flag.Z, Flag.S] as const;
const allFlags = [Flag.CY, Flag.P, Flag.AC, Flag.Z, Flag.S] as const;

function createDescriptor(
	group: OpcodeDescriptor["group"],
	opcode: OpcodeDescriptor["opcode"],
	format: OpcodeDescriptor["format"],
	origin: OpcodeDescriptor["origin"],
	flags: OpcodeDescriptor["flags"],
	duration: OpcodeDescriptor["duration"]
): OpcodeDescriptor {
	return { group, opcode, format, origin, flags, duration };
}

const descriptorTable: { [K in Opcode]: OpcodeDescriptor } = {
	[Opcode.ACI]: createDescriptor(Group.Arithmetic, Opcode.ACI, Format.Data8, 0xce, allFlags, 7),
	[Opcode.ADC]: createDescriptor(Group.Arithmetic, Opcode.ADC, Format.WordRegister, 0x88, allFlags, [4, 7]),
	[Opcode.ADD]: createDescriptor(Group.Arithmetic, Opcode.ADD, Format.WordRegister, 0x80, allFlags, [4, 7]),
	[Opcode.ADI]: createDescriptor(Group.Arithmetic, Opcode.ADI, Format.Data8, 0xc6, allFlags, 7),
	[Opcode.ANA]: createDescriptor(Group.Logical, Opcode.ANA, Format.WordRegister, 0xa0, allFlags, [4, 7]),
	[Opcode.ANI]: createDescriptor(Group.Logical, Opcode.ANI, Format.Data8, 0xe6, allFlags, 7),
	[Opcode.CALL]: createDescriptor(Group.Branch, Opcode.CALL, Format.Address, 0xcd, noFlags, 18),
	[Opcode.CC]: createDescriptor(Group.Branch, Opcode.CC, Format.Address, 0xdc, noFlags, [9, 18]),
	[Opcode.CM]: createDescriptor(Group.Branch, Opcode.CM, Format.Address, 0xfc, noFlags, [9, 18]),
	[Opcode.CMA]: createDescriptor(Group.Logical, Opcode.CMA, Format.NoOperands, 0x2f, noFlags, 4),
	[Opcode.CMC]: createDescriptor(Group.Logical, Opcode.CMC, Format.NoOperands, 0x3f, cyFlag, 4),
	[Opcode.CMP]: createDescriptor(Group.Logical, Opcode.CMP, Format.WordRegister, 0xb8, allFlags, [4, 7]),
	[Opcode.CNC]: createDescriptor(Group.Branch, Opcode.CNC, Format.Address, 0xd4, noFlags, [9, 18]),
	[Opcode.CNZ]: createDescriptor(Group.Branch, Opcode.CNZ, Format.Address, 0xc4, noFlags, [9, 18]),
	[Opcode.CP]: createDescriptor(Group.Branch, Opcode.CP, Format.Address, 0xf4, noFlags, [9, 18]),
	[Opcode.CPE]: createDescriptor(Group.Branch, Opcode.CPE, Format.Address, 0xec, noFlags, [9, 18]),
	[Opcode.CPI]: createDescriptor(Group.Logical, Opcode.CPI, Format.Data8, 0xfe, allFlags, 7),
	[Opcode.CPO]: createDescriptor(Group.Branch, Opcode.CPO, Format.Address, 0xe4, noFlags, [9, 18]),
	[Opcode.CZ]: createDescriptor(Group.Branch, Opcode.CZ, Format.Address, 0xcc, noFlags, [9, 18]),
	[Opcode.DAA]: createDescriptor(Group.Arithmetic, Opcode.DAA, Format.NoOperands, 0x27, allFlags, 4),
	[Opcode.DAD]: createDescriptor(Group.Arithmetic, Opcode.DAD, Format.PairRegister, 0x09, cyFlag, 10),
	[Opcode.DCR]: createDescriptor(Group.Arithmetic, Opcode.DCR, Format.WordRegister, 0x05, nonCyFlags, [4, 10]),
	[Opcode.DCX]: createDescriptor(Group.Arithmetic, Opcode.DCX, Format.PairRegister, 0x0b, noFlags, 6),
	[Opcode.DI]: createDescriptor(Group.Control, Opcode.DI, Format.NoOperands, 0xf3, noFlags, 4),
	[Opcode.EI]: createDescriptor(Group.Control, Opcode.EI, Format.NoOperands, 0xfb, noFlags, 4),
	[Opcode.HLT]: createDescriptor(Group.Control, Opcode.HLT, Format.NoOperands, 0x76, noFlags, 5),
	[Opcode.IN]: createDescriptor(Group.IO, Opcode.IN, Format.Data8, 0xdb, noFlags, 10),
	[Opcode.INR]: createDescriptor(Group.Arithmetic, Opcode.INR, Format.WordRegister, 0x04, nonCyFlags, [4, 10]),
	[Opcode.INX]: createDescriptor(Group.Arithmetic, Opcode.INX, Format.PairRegister, 0x03, noFlags, 6),
	[Opcode.JC]: createDescriptor(Group.Branch, Opcode.JC, Format.Address, 0xda, noFlags, [7, 10]),
	[Opcode.JM]: createDescriptor(Group.Branch, Opcode.JM, Format.Address, 0xfa, noFlags, [7, 10]),
	[Opcode.JMP]: createDescriptor(Group.Branch, Opcode.JMP, Format.Address, 0xc3, noFlags, 10),
	[Opcode.JNC]: createDescriptor(Group.Branch, Opcode.JNC, Format.Address, 0xd2, noFlags, [7, 10]),
	[Opcode.JNZ]: createDescriptor(Group.Branch, Opcode.JNZ, Format.Address, 0xc2, noFlags, [7, 10]),
	[Opcode.JP]: createDescriptor(Group.Branch, Opcode.JP, Format.Address, 0xf2, noFlags, [7, 10]),
	[Opcode.JPE]: createDescriptor(Group.Branch, Opcode.JPE, Format.Address, 0xea, noFlags, [7, 10]),
	[Opcode.JPO]: createDescriptor(Group.Branch, Opcode.JPO, Format.Address, 0xe2, noFlags, [7, 10]),
	[Opcode.JZ]: createDescriptor(Group.Branch, Opcode.JZ, Format.Address, 0xca, noFlags, [7, 10]),
	[Opcode.LDA]: createDescriptor(Group.DataTransfer, Opcode.LDA, Format.Address, 0x3a, noFlags, 13),
	[Opcode.LDAX]: createDescriptor(Group.DataTransfer, Opcode.LDAX, Format.PairRegister, 0x0a, noFlags, 7),
	[Opcode.LHLD]: createDescriptor(Group.DataTransfer, Opcode.LHLD, Format.Address, 0x2a, noFlags, 16),
	[Opcode.LXI]: createDescriptor(Group.DataTransfer, Opcode.LXI, Format.PairRegisterAndData16, 0x01, noFlags, 10),
	[Opcode.MOV]: createDescriptor(Group.DataTransfer, Opcode.MOV, Format.TwoWordRegisters, 0x40, noFlags, [4, 7]),
	[Opcode.MVI]: createDescriptor(Group.DataTransfer, Opcode.MVI, Format.WordRegisterAndData8, 0x06, noFlags, [7, 10]),
	[Opcode.NOP]: createDescriptor(Group.Control, Opcode.NOP, Format.NoOperands, 0x00, noFlags, 4),
	[Opcode.ORA]: createDescriptor(Group.Logical, Opcode.ORA, Format.WordRegister, 0xb0, allFlags, [4, 7]),
	[Opcode.ORI]: createDescriptor(Group.Logical, Opcode.ORI, Format.Data8, 0xf6, allFlags, 7),
	[Opcode.OUT]: createDescriptor(Group.IO, Opcode.OUT, Format.Data8, 0xd3, noFlags, 10),
	[Opcode.PCHL]: createDescriptor(Group.Branch, Opcode.PCHL, Format.NoOperands, 0xe9, noFlags, 6),
	[Opcode.POP]: createDescriptor(Group.Stack, Opcode.POP, Format.PushRegister, 0xc1, noFlags, 10),
	[Opcode.PUSH]: createDescriptor(Group.Stack, Opcode.PUSH, Format.PushRegister, 0xc5, noFlags, 12),
	[Opcode.RAL]: createDescriptor(Group.Logical, Opcode.RAL, Format.NoOperands, 0x17, cyFlag, 4),
	[Opcode.RAR]: createDescriptor(Group.Logical, Opcode.RAR, Format.NoOperands, 0x1f, cyFlag, 4),
	[Opcode.RC]: createDescriptor(Group.Branch, Opcode.RC, Format.NoOperands, 0xd8, noFlags, [6, 12]),
	[Opcode.RET]: createDescriptor(Group.Branch, Opcode.RET, Format.NoOperands, 0xc9, noFlags, 10),
	[Opcode.RIM]: createDescriptor(Group.Control, Opcode.RIM, Format.NoOperands, 0x20, noFlags, 4),
	[Opcode.RLC]: createDescriptor(Group.Logical, Opcode.RLC, Format.NoOperands, 0x07, cyFlag, 4),
	[Opcode.RM]: createDescriptor(Group.Branch, Opcode.RM, Format.NoOperands, 0xf8, noFlags, [6, 12]),
	[Opcode.RNC]: createDescriptor(Group.Branch, Opcode.RNC, Format.NoOperands, 0xd0, noFlags, [6, 12]),
	[Opcode.RNZ]: createDescriptor(Group.Branch, Opcode.RNZ, Format.NoOperands, 0xc0, noFlags, [6, 12]),
	[Opcode.RP]: createDescriptor(Group.Branch, Opcode.RP, Format.NoOperands, 0xf0, noFlags, [6, 12]),
	[Opcode.RPE]: createDescriptor(Group.Branch, Opcode.RPE, Format.NoOperands, 0xe8, noFlags, [6, 12]),
	[Opcode.RPO]: createDescriptor(Group.Branch, Opcode.RPO, Format.NoOperands, 0xe0, noFlags, [6, 12]),
	[Opcode.RRC]: createDescriptor(Group.Logical, Opcode.RRC, Format.NoOperands, 0x0f, cyFlag, 4),
	[Opcode.RST]: createDescriptor(Group.Branch, Opcode.RST, Format.RstValue, 0xc7, noFlags, 12),
	[Opcode.RZ]: createDescriptor(Group.Branch, Opcode.RZ, Format.NoOperands, 0xc8, noFlags, [6, 12]),
	[Opcode.SBB]: createDescriptor(Group.Arithmetic, Opcode.SBB, Format.WordRegister, 0x98, allFlags, [4, 7]),
	[Opcode.SBI]: createDescriptor(Group.Arithmetic, Opcode.SBI, Format.Data8, 0xde, allFlags, 7),
	[Opcode.SHLD]: createDescriptor(Group.DataTransfer, Opcode.SHLD, Format.Address, 0x22, noFlags, 16),
	[Opcode.SIM]: createDescriptor(Group.Control, Opcode.SIM, Format.NoOperands, 0x30, noFlags, 4),
	[Opcode.SPHL]: createDescriptor(Group.DataTransfer, Opcode.SPHL, Format.NoOperands, 0xf9, noFlags, 6),
	[Opcode.STA]: createDescriptor(Group.DataTransfer, Opcode.STA, Format.Address, 0x32, noFlags, 13),
	[Opcode.STAX]: createDescriptor(Group.DataTransfer, Opcode.STAX, Format.StaxRegister, 0x02, noFlags, 7),
	[Opcode.STC]: createDescriptor(Group.Logical, Opcode.STC, Format.NoOperands, 0x37, cyFlag, 4),
	[Opcode.SUB]: createDescriptor(Group.Arithmetic, Opcode.SUB, Format.WordRegister, 0x90, allFlags, [4, 7]),
	[Opcode.SUI]: createDescriptor(Group.Arithmetic, Opcode.SUI, Format.Data8, 0xd6, allFlags, 7),
	[Opcode.XCHG]: createDescriptor(Group.DataTransfer, Opcode.XCHG, Format.NoOperands, 0xeb, noFlags, 4),
	[Opcode.XRA]: createDescriptor(Group.Logical, Opcode.XRA, Format.WordRegister, 0xa8, allFlags, [4, 7]),
	[Opcode.XRI]: createDescriptor(Group.Logical, Opcode.XRI, Format.Data8, 0xee, allFlags, 7),
	[Opcode.XTHL]: createDescriptor(Group.Stack, Opcode.XTHL, Format.NoOperands, 0xe3, noFlags, 16)
} as const;

// prettier-ignore
const opcodeTable: readonly (Opcode | undefined)[] = [
	Opcode.NOP, Opcode.LXI,  Opcode.STAX, Opcode.INX,  Opcode.INR, Opcode.DCR,  Opcode.MVI, Opcode.RLC,
	undefined,  Opcode.DAD,  Opcode.LDAX, Opcode.DCX,  Opcode.INR, Opcode.DCR,  Opcode.MVI, Opcode.RRC,
	undefined,  Opcode.LXI,  Opcode.STAX, Opcode.INX,  Opcode.INR, Opcode.DCR,  Opcode.MVI, Opcode.RAL,
	undefined,  Opcode.DAD,  Opcode.LDAX, Opcode.DCX,  Opcode.INR, Opcode.DCR,  Opcode.MVI, Opcode.RAR,
	Opcode.RIM, Opcode.LXI,  Opcode.SHLD, Opcode.INX,  Opcode.INR, Opcode.DCR,  Opcode.MVI, Opcode.DAA,
	undefined,  Opcode.DAD,  Opcode.LHLD, Opcode.DCX,  Opcode.INR, Opcode.DCR,  Opcode.MVI, Opcode.CMA,
	Opcode.SIM, Opcode.LXI,  Opcode.STA,  Opcode.INX,  Opcode.INR, Opcode.DCR,  Opcode.MVI, Opcode.STC,
	undefined,  Opcode.DAD,  Opcode.LDA,  Opcode.DCX,  Opcode.INR, Opcode.DCR,  Opcode.MVI, Opcode.CMC,
	Opcode.MOV, Opcode.MOV,  Opcode.MOV,  Opcode.MOV,  Opcode.MOV, Opcode.MOV,  Opcode.MOV, Opcode.MOV,
	Opcode.MOV, Opcode.MOV,  Opcode.MOV,  Opcode.MOV,  Opcode.MOV, Opcode.MOV,  Opcode.MOV, Opcode.MOV,
	Opcode.MOV, Opcode.MOV,  Opcode.MOV,  Opcode.MOV,  Opcode.MOV, Opcode.MOV,  Opcode.MOV, Opcode.MOV,
	Opcode.MOV, Opcode.MOV,  Opcode.MOV,  Opcode.MOV,  Opcode.MOV, Opcode.MOV,  Opcode.MOV, Opcode.MOV,
	Opcode.MOV, Opcode.MOV,  Opcode.MOV,  Opcode.MOV,  Opcode.MOV, Opcode.MOV,  Opcode.MOV, Opcode.MOV,
	Opcode.MOV, Opcode.MOV,  Opcode.MOV,  Opcode.MOV,  Opcode.MOV, Opcode.MOV,  Opcode.MOV, Opcode.MOV,
	Opcode.MOV, Opcode.MOV,  Opcode.MOV,  Opcode.MOV,  Opcode.MOV, Opcode.MOV,  Opcode.HLT, Opcode.MOV,
	Opcode.MOV, Opcode.MOV,  Opcode.MOV,  Opcode.MOV,  Opcode.MOV, Opcode.MOV,  Opcode.MOV, Opcode.MOV,
	Opcode.ADD, Opcode.ADD,  Opcode.ADD,  Opcode.ADD,  Opcode.ADD, Opcode.ADD,  Opcode.ADD, Opcode.ADD,
	Opcode.ADC, Opcode.ADC,  Opcode.ADC,  Opcode.ADC,  Opcode.ADC, Opcode.ADC,  Opcode.ADC, Opcode.ADC,
	Opcode.SUB, Opcode.SUB,  Opcode.SUB,  Opcode.SUB,  Opcode.SUB, Opcode.SUB,  Opcode.SUB, Opcode.SUB,
	Opcode.SBB, Opcode.SBB,  Opcode.SBB,  Opcode.SBB,  Opcode.SBB, Opcode.SBB,  Opcode.SBB, Opcode.SBB,
	Opcode.ANA, Opcode.ANA,  Opcode.ANA,  Opcode.ANA,  Opcode.ANA, Opcode.ANA,  Opcode.ANA, Opcode.ANA,
	Opcode.XRA, Opcode.XRA,  Opcode.XRA,  Opcode.XRA,  Opcode.XRA, Opcode.XRA,  Opcode.XRA, Opcode.XRA,
	Opcode.ORA, Opcode.ORA,  Opcode.ORA,  Opcode.ORA,  Opcode.ORA, Opcode.ORA,  Opcode.ORA, Opcode.ORA,
	Opcode.CMP, Opcode.CMP,  Opcode.CMP,  Opcode.CMP,  Opcode.CMP, Opcode.CMP,  Opcode.CMP, Opcode.CMP,
	Opcode.RNZ, Opcode.POP,  Opcode.JNZ,  Opcode.JMP,  Opcode.CNZ, Opcode.PUSH, Opcode.ADI, Opcode.RST,
	Opcode.RZ,  Opcode.RET,  Opcode.JZ,   undefined,   Opcode.CZ,  Opcode.CALL, Opcode.ACI, Opcode.RST,
	Opcode.RNC, Opcode.POP,  Opcode.JNC,  Opcode.OUT,  Opcode.CNC, Opcode.PUSH, Opcode.SUI, Opcode.RST,
	Opcode.RC,  undefined,   Opcode.JC,   Opcode.IN,   Opcode.CC,  undefined,   Opcode.SBI, Opcode.RST,
	Opcode.RPO, Opcode.POP,  Opcode.JPO,  Opcode.XTHL, Opcode.CPO, Opcode.PUSH, Opcode.ANI, Opcode.RST,
	Opcode.RPE, Opcode.PCHL, Opcode.JPE,  Opcode.XCHG, Opcode.CPE, undefined,   Opcode.XRI, Opcode.RST,
	Opcode.RP,  Opcode.POP,  Opcode.JP,   Opcode.DI,   Opcode.CP,  Opcode.PUSH, Opcode.ORI, Opcode.RST,
	Opcode.RM,  Opcode.SPHL, Opcode.JM,   Opcode.EI,   Opcode.CM,  undefined,   Opcode.CPI, Opcode.RST
] as const;
