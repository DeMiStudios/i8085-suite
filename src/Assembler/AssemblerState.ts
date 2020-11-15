import { readFileSync } from "fs";
import type { Diagnostic, DiagnosticFactory } from "Shared/Diagnostic";
import { DiagnosticCategory, getDiagnosticMessage, isDiagnosticWithLocation } from "Shared/Diagnostic";
import type ast from "./ast";
import { TokenKind } from "./TokenKind";
import type { LineMap } from "./utility/LineMap";
import { generateLineMap, getLineAndColumnOfPosition } from "./utility/LineMap";

export class AssemblerState {
	public readonly file: string;
	public readonly debug: boolean;
	public readonly source: string;
	public readonly lineMap: LineMap;
	public readonly diagnostics: Diagnostic[] = [];
	/** @internal Scanner */ public position = 0;
	/** @internal Scanner */ public lastPosition = 0;
	/** @internal Scanner */ public eofReached = false;
	/** @internal Scanner */ public token: TokenKind = TokenKind.EndOfFile;
	/** @internal Parser */ public tree: ast.Source | undefined;

	public constructor(
		file: string,
		properties?: {
			/** generate line map and save all node children */
			debug?: boolean;
			/** source code; file is not read from */
			source?: string;
		}
	) {
		this.file = file;
		this.debug = properties?.debug ?? false;
		this.source = properties?.source ?? readFileSync(file, "utf8");
		this.lineMap = this.debug ? generateLineMap(this.source) : [];
		this.diagnostics = [];
	}

	public addDiagnostic(factory: DiagnosticFactory): void {
		const diagnostic = factory(this.file, this.lastPosition, this.position - this.lastPosition);

		if (this.debug) {
			this.diagnostics.push(diagnostic);
		} else if (diagnostic.category === DiagnosticCategory.Error) {
			throw new Error(this.formatDiagnostic(diagnostic));
		}
	}

	public formatDiagnostic(diagnostic: Diagnostic): string {
		if (this.debug && isDiagnosticWithLocation(diagnostic)) {
			const [line, column] = getLineAndColumnOfPosition(this.lineMap, diagnostic.position);
			return `${diagnostic.file}:${line + 1}:${column + 1}: ${getDiagnosticMessage(diagnostic)}`;
		} else {
			return getDiagnosticMessage(diagnostic);
		}
	}

	public getToken(): TokenKind {
		return this.token;
	}

	public getTokenPosition(): number {
		return this.lastPosition;
	}

	public getTokenLength(): number {
		return this.position - this.lastPosition;
	}

	public getTokenLexeme(): string {
		return this.source.substring(this.lastPosition, this.position);
	}

	public getSyntaxTree(): ast.Source | undefined {
		return this.tree;
	}
}
