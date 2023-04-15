import { User }          from "../Class/User.Class";
import { UploadedFile }  from "express-fileupload";
import { EDesignerSize } from "../Enum/EDesignerSize";
import { IMO_Blueprint } from "./MongoDB";
import {
	FilterQuery,
	QueryOptions
}                        from "mongoose";

export type RequestWithUser<T = any> = {
	UserClass? : T;
}

export type IRequestBody<T> = RequestWithUser<User> & Partial<T>;

export type TRequest_Unknown<UseUser extends boolean = true, UserType = any> = IRequestBody<unknown, UseUser, UserType>;

// ----------------------------------------
// ----------------- Auth -----------------
// ----------------------------------------

export type TRequest_Auth_Logout = IRequestBody<{
	Token : string;
}>;
export type TRequest_Auth_SignIn = IRequestBody<{
	Login : string;
	Password : string;
}>;
export type TRequest_Auth_SignUp = IRequestBody<{
	Login : string;
	EMail : string;
	Password : string;
	RepeatPassword : string;
}>;
export type TRequest_Auth_Vertify = IRequestBody<{
	Token : string
}>;

// -------------------------------------------
// ----------------- BP_Util -----------------
// -------------------------------------------

export type TRequest_BPU_ParseBlueprint = IRequestBody<{
	BlueprintName : string;
}>;

// --------------------------------------
// ----------------- BP -----------------
// --------------------------------------

export type TRequest_BP_Get = IRequestBody<{
	Filter : FilterQuery<IMO_Blueprint>,
	Options : QueryOptions<IMO_Blueprint>
}>;

export type TRequest_BP_Num = IRequestBody<{
	Filter : FilterQuery<IMO_Blueprint>,
	Options : QueryOptions<IMO_Blueprint>
}>;


// -------------------------------------------
// ----------------- BP_User -----------------
// -------------------------------------------


export type TRequest_BPUser_ToggleLike = IRequestBody<{
	Id : string;
}>;
export type TRequest_BPUser_Create = IRequestBody<{
	BlueprintName : string;
	BlueprintDesc : string;
	BlueprintTags : string[];
	BlueprintMods : string[];
	DesignerSize : EDesignerSize;
}>;
export type TRequest_BPUser_Create_Files = Partial<{
	SBP : UploadedFile;
	SBPCFG : UploadedFile;
	Image : UploadedFile;
	Logo : UploadedFile;
}>

// ----------------------------------------
// ----------------- Tags -----------------
// ----------------------------------------

export type TRequest_Tags_Mods = IRequestBody<{
	limit : number;
	filter : string;
}>;
export type TRequest_Tags_Tags = IRequestBody<{
	limit : number;
	filter : string;
}>;