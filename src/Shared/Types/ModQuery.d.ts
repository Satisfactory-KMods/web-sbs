export interface ModGraphQLRequest {
	getMods : GetMods;
}

export interface GetMods {
	mods : IMod[];
	count : number;
}

export interface IMod {
	id : string;
	mod_reference : string;
	name : string;
	logo : string;
	short_description : string;
	source_url : string;
	creator_id : string;
	views : number;
	downloads : number;
	updated_at : Date;
	created_at : Date;
	last_version_date : Date;
	hidden : boolean;
	authors : Author[];
	latestVersions : LatestVersions;
}

export interface Author {
	user_id : string;
	mod_id : string;
	role : string;
	user : User;
}

export interface User {
	id : string;
	username : string;
}

export interface LatestVersions {
	alpha : Version | undefined;
	beta : Version | undefined;
	release : Version | undefined;
}

export interface Version {
	version : string;
	sml_version : string;
	id : string;
}
