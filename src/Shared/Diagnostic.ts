export interface Diagnostic {
	readonly category: DiagnosticCategory;
	readonly message: string;
	readonly file?: string;
	readonly position?: number;
	readonly length?: number;
}

export interface DiagnosticWithLocation extends Diagnostic {
	readonly file: string;
	readonly position: number;
	readonly length: number;
}

export enum DiagnosticCategory {
	Note = "\x1B[36mnote\x1B[0m",
	Warning = "\x1B[33mwarning\x1B[0m",
	Error = "\x1B[31merror\x1B[0m"
}

export type DiagnosticFactory = (file: string, position: number, length: number) => DiagnosticWithLocation;

export function diagnosticFactory(category: DiagnosticCategory, message: string): DiagnosticFactory {
	return (file, position, length) => ({ category, message, file, position, length });
}

export function isDiagnosticWithLocation(diagnostic: Diagnostic): diagnostic is DiagnosticWithLocation {
	return diagnostic.file !== undefined && diagnostic.position !== undefined && diagnostic.length !== undefined;
}

export function getDiagnosticMessage(diagnostic: Diagnostic): string {
	return `${diagnostic.category}: ${diagnostic.message}`;
}
