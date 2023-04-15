export enum EApiAuth {
	logout = "auth/logout",
	validate = "auth/validate",
	signup = "auth/signup",
	signin = "auth/signin"
}

export enum EApiBlueprintUtils {
	parseblueprint = "blueprintutils/parseblueprint"
}

export enum EApiUserBlueprints {
	create = "userbp/create"
}

export enum EApiTags {
	mods = "tags/getmods",
	tags = "tags/gettags"
}

export enum EApiAdminBlueprints {
	remove = "adminbp/remove"
}

export type TApiPath = EApiAuth | EApiBlueprintUtils | EApiUserBlueprints | EApiAdminBlueprints | EApiTags;