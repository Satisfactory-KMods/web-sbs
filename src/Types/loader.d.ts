import type {
	MO_Blueprint,
	MO_BlueprintPack
}               from "@shared/Types/MongoDB";
import type { User } from "@shared/Class/User.Class";

export interface LoaderDataBase {
	loggedIn : boolean;
	user : User;
}

export interface LoaderBlueprintBase extends LoaderDataBase {
	blueprintPermission : boolean;
	blueprintData : MO_Blueprint;
}

export interface LoaderBlueprintPack extends LoaderDataBase {
	blueprintPermission : boolean;
	blueprintDatas : MO_Blueprint;
	blueprintPack : MO_BlueprintPack;
}