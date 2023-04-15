import { Parser } from "@etothepii/satisfactory-file-parser";

export class BlueprintParser {
	private readonly Data;
	private readonly CachedName;

	constructor( Name : string, sbp : Buffer, sbpcfg : Buffer ) {
		this.CachedName = Name;
		this.Data = Parser.ParseBlueprintFiles( Name, sbp, sbpcfg );
	}

	public get Get() {
		return this.Data;
	}

	public get Name() {
		return this.CachedName;
	}

	public get BpName() {
		return this.Data.name;
	}

	public get BpDesc() {
		return this.Data.config.description;
	}

	public get ObjCount() {
		return this.Data.objects.length;
	}
}