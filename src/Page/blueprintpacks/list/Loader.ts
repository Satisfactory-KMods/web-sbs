import type { LoaderDataBase } from "@app/Types/loader";
import { validateLogin } from "@applib/loaderHelper";
import {
	tRPCHandleError,
	tRPCPublic
} from "@applib/tRPC";
import type { BlueprintPackExtended } from "@server/MongoDB/MongoBlueprints";
import type { LoaderFunction } from "react-router-dom";
import { json } from "react-router-dom";


export type BlueprintPackListLoaderData = LoaderDataBase & {
	blueprintPacks: BlueprintPackExtended[],
	totalBlueprints: number
};

export const loader: LoaderFunction = async( { params, request } ) => {
	const result = await validateLogin( { params, request } );
	if( result instanceof Response ) {
		return result;
	}
	const Blueprints = await tRPCPublic.blueprintPacks.getBlueprintPacks.query( { limit: 12 } ).catch( tRPCHandleError );
	const blueprintPacks: BlueprintPackExtended[] = Blueprints?.blueprintPacks || [];
	const totalBlueprints = Blueprints?.totalBlueprints || 0;

	return json<BlueprintPackListLoaderData>( { ...result, blueprintPacks, totalBlueprints } );
};
