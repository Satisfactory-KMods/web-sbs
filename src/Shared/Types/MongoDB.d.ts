import { EDesignerSize } from "../Enum/EDesignerSize";
import { ERoles }        from "../Enum/ERoles";

export interface IMongoDB {
	_id : string,
	__v : number,
	createdAt? : string,
	updatedAt? : string
}

export interface IMO_Blueprint extends IMongoDB {
	name : string,
	description : string,
	tags : string[],
	mods : string[],
	likes : string[],
	size : EDesignerSize
}

export interface IMO_UserAccount extends IMongoDB {
	username : string,
	hash? : string,
	salt? : string,
	email : string,
	role : ERoles
}