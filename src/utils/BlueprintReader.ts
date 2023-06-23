import type { Blueprint } from "@etothepii/satisfactory-file-parser";
import { Parser } from "@etothepii/satisfactory-file-parser";
import { readFileSync } from "fs";
import { join } from "path";


class BlueprintReader {
	private path: string;
	private fileName: string;
	private blueprintName: string;
	private data: Blueprint | undefined;

	constructor( path: string, fileName: string, blueprintName?: string ) {
		this.path = path;
		this.fileName = fileName;
		this.blueprintName = blueprintName ?? this.fileName;
		this.data = this.read();
	}

	public get success() {
		return !!this.blueprintName;
	}

	public get blueprintData() {
		return this.data!;
	}

	private read(): Blueprint | undefined {
		try {
			const sbp = readFileSync( join( this.path, this.fileName + ".sbp" ) );
			const sbpcfg = readFileSync( join( this.path, this.fileName + ".sbpcfg" ) );
			return Parser.ParseBlueprintFiles( this.blueprintName, sbp, sbpcfg );
		} catch( e ) {
			if( e instanceof Error ) {
				console.error( e.message );
			}
		}
		return undefined;
	}
}

