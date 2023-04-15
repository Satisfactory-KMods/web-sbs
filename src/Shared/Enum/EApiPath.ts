export enum EApiAuth {
	logout = "auth/logout",
	validate = "auth/validate",
	signup = "auth/signup",
	signin = "auth/signin"
}


export type TApiPath = EApiAuth;