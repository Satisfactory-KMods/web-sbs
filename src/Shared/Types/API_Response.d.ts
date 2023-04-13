/** @format */

type ResponseBase<T = any> = {
	Success : boolean;
	Auth : boolean;
	Data : T;
	Reached? : boolean;
	MessageCode? : string;
}

export type IAPIResponseBase<T = any> = ResponseBase<T>;

export type TResponse_AnyData<MessageOpt extends boolean = false> = IAPIResponseBase<MessageOpt>;

// ----------------------------------------
// ----------------- Auth -----------------
// ----------------------------------------

export type TResponse_Auth_SignUp = IAPIResponseBase<>;
export type TResponse_Auth_SignIn = IAPIResponseBase<>;
export type TResponse_Auth_Vertify = IAPIResponseBase<>;