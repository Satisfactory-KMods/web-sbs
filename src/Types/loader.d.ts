import type { BlueprintData } from '@server/MongoDB/MongoBlueprints';
import type { User } from '@shared/Class/User.Class';

export interface LoaderDataBase {
	loggedIn: boolean;
	user: User;
}

export interface LoaderBlueprintBase extends LoaderDataBase {
	blueprintPermission: boolean;
	blueprintData: BlueprintData;
	blueprintOwner: { id: string; username: string };
}
