# Intel 8085 Suite

## Badges
[![test](https://github.com/DeMiStudios/i8085-suite/workflows/test/badge.svg)](https://github.com/DeMiStudios/i8085-suite/actions)
[![codecov](https://codecov.io/gh/DeMiStudios/i8085-suite/branch/master/graph/badge.svg?token=0KUII4DLVU)](https://codecov.io/gh/DeMiStudios/i8085-suite)

## Introduction
The Intel 8085 Suite (**i8085 suite**) is a collection of programs used to aid in the development of programs targeting
the Intel 8085 architecture. The **i8085 suite** is comprised of: an assembler, disassembler, linker, emulator, and
debugger.

The **i8085 suite** is not intended to be used for professional 8085 development and emulation.

## Features
- [ ] Assembler (**i8085 assembler**)
- [ ] Disassembler (**i8085 disassembler**)
- [ ] Linker (**i8085 linker**)
- [ ] Emulator (**i8085 emulator**)
- [ ] Debugger (**i8085 debugger**)

## Goals
- The **i8085 assembler** supports common assembler directives, constant expressions, macros, etc. with an accurate
source listing that can be used by the **i8085 debugger**.
- The **i8085 disassembler** supports the emission of labels for jumps, calls, and data unassociated with a symbol.
- The **i8085 linker** supports referencing the symbols of other modules (object files).
- The **i80805 emulator** can emulate instructions correctly in a duration proportional to the op-code's latency.
- The **i8085 debugger** supports querying and altering registers and memory, conditional breakpoints, common debugging
logic (step into, step out, step over, continue), checkpoints, etc.
- A CLI and a web interface to interact with the suite.

## Non-Goals
- Supporting undocumented 8085 instructions and flags.
