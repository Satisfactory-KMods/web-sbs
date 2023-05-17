/** @format */
import type { ILang } from "@app/Types/lang";
import type { Blueprint } from "@etothepii/satisfactory-file-parser";


type ResponseBase<T = any> = {
	Success: boolean;
	Auth: boolean;
	Data?: T;
	Reached: boolean;
	MessageCode?: keyof ILang["ApiMessgaes"];
};

export type IAPIResponseBase<T = any> = ResponseBase<T>;

export type TResponse_AnyData<MessageOpt extends boolean = false> = IAPIResponseBase<MessageOpt>;

// ----------------------------------------
// ----------------- Auth -----------------
// ----------------------------------------

export type TResponse_Auth_SignUp = IAPIResponseBase<{
	Token: string;
}>;
export type TResponse_Auth_SignIn = TResponse_Auth_SignUp;
export type TResponse_Auth_Vertify = IAPIResponseBase<>;
export type TResponse_Auth_Modify = IAPIResponseBase<>;

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
export type TResponse_BPUser_Edit = IAPIResponseBase<string>;
export type TResponse_BPUser_ToggleLike = IAPIResponseBase<string[]>;

// ---------------------------------------
// ----------------- BPP -----------------
// ---------------------------------------

export type TResponse_BPP = IAPIResponseBase;
export type TResponse_BPP_PUT = IAPIResponseBase<string>;

// ----------------------------------------
// ----------------- Tags -----------------
// ----------------------------------------

export type TResponse_Tags_Modify = IAPIResponseBase;
