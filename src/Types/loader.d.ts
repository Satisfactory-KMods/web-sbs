import type { User }     from "@shared/Class/User.Class";
import type { BlueprintData } from "@server/MongoDB/DB_Blueprints";

export interface LoaderDataBase {
	loggedIn : boolean;
	user : User;
}

export interface LoaderBlueprintBase extends LoaderDataBase {
	blueprintPermission : boolean;
	blueprintData : BlueprintData;
}