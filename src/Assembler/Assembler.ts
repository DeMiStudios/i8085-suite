import { readFileSync } from "fs";
import type { Diagnostic, DiagnosticFactory } from "Shared/Diagnostic";
import { DiagnosticCategory, getDiagnosticMessage, isDiagnosticWithLocation } from "Shared/Diagnostic";
import type { LineMap } from "./utility/LineMap";
import { generateLineMap, getLineAndColumnOfPosition } from "./utility/LineMap";

export class Assembler {
	public readonly file: string;
	public readonly debug: boolean;
	public readonly source: string;
	public readonly lineMap: LineMap;
	public readonly skipTrivia: boolean;
	public readonly diagnostics: Diagnostic[] = [];
	/** @internal */ public position = 0;
	/** @internal */ public lastPosition = 0;
	/** @internal */ public eofReached = false;

	public constructor(
		file: string,
		properties?: {
			debug?: boolean;
			source?: string;
			skipTrivia?: boolean;
		}
	) {
		this.file = file;
		this.debug = properties?.debug ?? false;
		this.source = properties?.source ?? readFileSync(file, "utf8");
		this.lineMap = this.debug ? generateLineMap(this.source) : [];
		this.diagnostics = [];
		this.skipTrivia = properties?.skipTrivia ?? false;
	}

	public addDiagnostic(factory: DiagnosticFactory): void {
		const diagnostic = factory(this.file, this.lastPosition, this.position - this.lastPosition);

		if (this.debug) {
			this.diagnostics.push(diagnostic);
		} else if (diagnostic.category === DiagnosticCategory.Error) {
			throw new Error(this.formatDiagnostic(diagnostic));
		}
	}

	private formatDiagnostic(diagnostic: Diagnostic): string {
		let prefix = "";

		if (this.debug && isDiagnosticWithLocation(diagnostic)) {
			const [line, column] = getLineAndColumnOfPosition(this.lineMap, diagnostic.position);
			prefix = `${diagnostic.file}:${line + 1}:${column + 1}: `;
		}

		return `${prefix}${getDiagnosticMessage(diagnostic)}`;
	}

	public getLexeme(): string {
		return this.source.substring(this.lastPosition, this.position);
	}
}
