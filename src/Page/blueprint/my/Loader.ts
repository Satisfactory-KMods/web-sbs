
import type { IndexLoaderData } from "@app/Page/blueprint/list/Loader";
import { LoginRule, validateLogin } from "@applib/loaderHelper";
import {
	tRPC_Auth,
	tRPC_handleError
} from "@applib/tRPC";
import type { BlueprintData } from "@server/MongoDB/DB_Blueprints";
import type { LoaderFunction } from "react-router-dom";
import { json } from "react-router-dom";

export const loader: LoaderFunction = async( { params, request } ) => {
	const result = await validateLogin( { params, request }, LoginRule.LoggedIn, "/account/signin" );
	if( result instanceof Response ) {
		return result;
	}
	const Blueprints = await tRPC_Auth.blueprints.myBlueprints.query( { limit: 10 } ).catch( tRPC_handleError );
	const blueprints: BlueprintData[] = Blueprints?.blueprints || [];
	const totalBlueprints: number = Blueprints?.totalBlueprints || 0;

	return json<IndexLoaderData>( { ...result, blueprints, totalBlueprints } );
};