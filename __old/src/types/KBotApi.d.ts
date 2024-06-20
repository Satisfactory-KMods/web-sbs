export interface KBotModApiResult {
	success: boolean;
	mods: ApiMod[];
}

export interface ApiMod extends MongoDBSchema {
	versions: ModVersion[];
	id: string;
	mod_reference: string;
	name: string;
	logo: string;
	short_description: string;
	source_url: string;
	creator_id: string;
	views: number;
	downloads: number;
	updated_at: Date;
	created_at: Date;
	last_version_date: Date;
	hidden: boolean;
	authors: Author[];
	latestVersions: LatestVersions;
}

export interface Author {
	user_id: string;
	mod_id: string;
	role: string;
	user: UserSchema;
}

export interface UserSchema {
	id: string;
	username: string;
}

export interface LatestVersions {
	alpha: ModVersion | undefined;
	beta: ModVersion | undefined;
	release: ModVersion | undefined;
}

export interface ModVersion {
	version: string;
	sml_version: string;
	id: string;
	created_at: Date;
	updated_at: Date;
	changelog: string;
	hash: string;
}
