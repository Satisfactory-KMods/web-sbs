/** @format */
import { Blueprint } from "@etothepii/satisfactory-file-parser";
import {
	IMO_Mod,
	IMO_Tag
}                    from "./MongoDB";

type ResponseBase<T = any> = {
	Success : boolean;
	Auth : boolean;
	Data? : T;
	Reached : boolean;
	MessageCode? : string;
}

export type IAPIResponseBase<T = any> = ResponseBase<T>;

export type TResponse_AnyData<MessageOpt extends boolean = false> = IAPIResponseBase<MessageOpt>;

// ----------------------------------------
// ----------------- Auth -----------------
// ----------------------------------------

export type TResponse_Auth_SignUp = IAPIResponseBase<{
	Token : string;
}>;
export type TResponse_Auth_SignIn = TResponse_Auth_SignUp;
export type TResponse_Auth_Vertify = IAPIResponseBase<>;

// --------------------------------------
// ----------------- BP -----------------
// --------------------------------------

export type TResponse_BP_Questionary<T = any> = IAPIResponseBase<T>;

// -------------------------------------------
// ----------------- BP_Util -----------------
// -------------------------------------------

export type TResponse_BPU_ParseBlueprint = IAPIResponseBase<Blueprint>;

// -------------------------------------------
// ----------------- BP_User -----------------
// -------------------------------------------

export type TResponse_BPUser_Create = IAPIResponseBase<string>;
export type TResponse_BPUser_ToggleLike = IAPIResponseBase<string[]>;

// ----------------------------------------
// ----------------- Tags -----------------
// ----------------------------------------

export type TResponse_Tags_Mods = IAPIResponseBase<IMO_Mod[]>;
export type TResponse_Tags_Tags = IAPIResponseBase<IMO_Tag[]>;