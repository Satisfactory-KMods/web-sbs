export enum EApiAuth {
	logout = "auth/logout",
	validate = "auth/validate",
	signup = "auth/signup",
	signin = "auth/signin"
}

export enum EApiBlueprintUtils {
	parseblueprint = "blueprintutils/parseblueprint"
}


export enum EApiBlueprint {
	get = "blueprints/get",
	num = "blueprints/num"
}

export enum EApiUserBlueprints {
	create = "userbp/create",
	like = "userbp/like"
}

export enum EApiTags {
	mods = "tags/getmods",
	tags = "tags/gettags"
}

export enum EApiAdminBlueprints {
	remove = "adminbp/remove"
}

export type TApiPath =
	EApiAuth
	| EApiBlueprintUtils
	| EApiUserBlueprints
	| EApiAdminBlueprints
	| EApiTags
	| EApiBlueprint;