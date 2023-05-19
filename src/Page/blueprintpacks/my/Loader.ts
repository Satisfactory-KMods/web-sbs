
import type { BlueprintPackListLoaderData } from "@app/Page/blueprintpacks/list/Loader";
import { LoginRule, validateLogin } from "@applib/loaderHelper";
import {
	tRPCAuth,
	tRPCHandleError
} from "@applib/tRPC";
import type { BlueprintPackExtended } from "@server/MongoDB/MongoBlueprints";
import type { LoaderFunction } from "react-router-dom";
import { json } from "react-router-dom";


export const loader: LoaderFunction = async( { params, request } ) => {
	const result = await validateLogin( { params, request }, LoginRule.LoggedIn, "/account/signin" );
	if( result instanceof Response ) {
		return result;
	}
	const queryResult = await tRPCAuth.blueprintPacks.my.query( { limit: 20 } ).catch( tRPCHandleError );
	const blueprintPacks: BlueprintPackExtended[] = queryResult?.blueprintPacks || [];
	const totalBlueprints: number = queryResult?.totalBlueprints || 0;

	return json<BlueprintPackListLoaderData>( { ...result, blueprintPacks, totalBlueprints } );
};
