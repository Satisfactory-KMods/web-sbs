import type { User } from "@shared/Class/User.Class";

export interface LoaderDataBase {
	loggedIn : boolean;
	user : User;
}

export interface LoaderBlueprintBase extends LoaderDataBase {
	blueprintPermission : boolean;
	blueprintData : Blueprint;
}

export interface LoaderBlueprintPack extends LoaderDataBase {
	blueprintPermission : boolean;
	blueprintDatas : Blueprint;
	blueprintPack : BlueprintPack;
}