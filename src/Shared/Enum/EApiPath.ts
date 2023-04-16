export enum EApiAuth {
	logout = "auth/logout",
	validate = "auth/validate",
	signup = "auth/signup",
	signin = "auth/signin"
}

export enum EApiBlueprintUtils {
	parseblueprint = "blueprintutils/parseblueprint",
	readblueprint = "blueprintutils/readblueprint"
}


export enum EApiQuestionary {
	blueprints = "questionary/blueprints",
	num = "questionary/num",
	tags = "questionary/tags",
	mods = "questionary/mods"
}

export enum EApiUserBlueprints {
	create = "userbp/create",
	edit = "userbp/edit",
	like = "userbp/like",
	blacklist = "userbp/blacklist",
	remove = "userbp/remove"
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
	| EApiQuestionary;