import type { BlueprintData } from "@server/MongoDB/DB_Blueprints";
import type { User } from "@shared/Class/User.Class";

export interface LoaderDataBase {
	loggedIn : boolean;
	user : User;
}

export interface LoaderBlueprintBase extends LoaderDataBase {
	blueprintPermission : boolean;
	blueprintData : BlueprintData;
}