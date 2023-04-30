import type {
	Blueprint} from "@etothepii/satisfactory-file-parser";
import {
	Parser
} from "@etothepii/satisfactory-file-parser";

export class BlueprintParser {
	public readonly Success;
	private readonly Data : Blueprint | undefined;
	private readonly CachedName;

	constructor( Name : string, sbp : Buffer, sbpcfg : Buffer ) {
		this.CachedName = Name;
		try {
			this.Data = Parser.ParseBlueprintFiles( Name, sbp, sbpcfg );
			this.Success = true;
		}
		catch ( e ) {
			if ( e instanceof Error ) {
				SystemLib.LogError( "api", e.message );
			}
			this.Data = undefined;
			this.Success = false;
		}
	}

	public get Get() {
		return this.Data;
	}

	public get Name() {
		return this.CachedName;
	}

	public get BpName() {
		return this.Data?.name;
	}

	public get BpDesc() {
		return this.Data?.config.description;
	}

	public get ObjCount() {
		return this.Data?.objects.length;
	}
}