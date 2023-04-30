import type { EDesignerSize } from "@shared/Enum/EDesignerSize";
import type { ERoles }        from "@shared/Enum/ERoles";
import type { IMod }          from "@shared/Types/ModQuery";

export interface IMongoDB {
	_id : string,
	__v : number,
	createdAt? : string,
	updatedAt? : string
}

export interface MO_Blueprint extends IMongoDB {
	name : string,
	DesignerSize : EDesignerSize,
	description : string,
	tags : string[],
	mods : string[],
	likes : string[],
	owner : string,
	downloads : number,
	blacklisted? : boolean
}

export interface MO_BlueprintPack extends IMongoDB {
	name : string,
	description : string,
	tags : string[],
	mods : string[],
	likes : string[],
	owner : string,
	downloads : number,
	blacklisted? : boolean,
	blueprints : string[]
}

export interface MO_UserAccount extends IMongoDB {
	username : string,
	hash? : string,
	salt? : string,
	email : string,
	role : ERoles
}

export interface MO_Tag extends IMongoDB {
	DisplayName : string;
}

export interface MO_Mod extends IMongoDB, IMod {
}

export interface MO_UserAccountToken extends IMongoDB {
	userid : string,
	token : string,
	expire : Date
}