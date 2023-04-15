import { User } from "../Class/User.Class";

export type RequestWithUser<T = any> = {
	UserClass? : T;
}

export type IRequestBody<T> = RequestWithUser<User> & Partial<T>;

export type TRequest_Unknown<UseUser extends boolean = true, UserType = any> = IRequestBody<unknown, UseUser, UserType>;

// ----------------------------------------
// ----------------- Auth -----------------
// ----------------------------------------

export type TRequest_Auth_SignIn = IRequestBody<{
	Login : string;
	Password : string;
}>;
export type TRequest_Auth_SignUp = IRequestBody<>;
export type TRequest_Auth_Vertify = IRequestBody<>;