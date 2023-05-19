import type { IndexLoaderData } from '@app/Page/blueprint/list/Loader';
import { LoginRule, validateLogin } from "@applib/loaderHelper";
import {
	tRPCAuth,
	tRPCHandleError
} from "@applib/tRPC";
import type { BlueprintData } from '@server/MongoDB/MongoBlueprints';
import type { LoaderFunction } from "react-router-dom";
import { json } from "react-router-dom";


export const loader: LoaderFunction = async( { params, request } ) => {
	const result = await validateLogin( { params, request }, LoginRule.LoggedIn, "/account/signin" );
	if( result instanceof Response ) {
		return result;
	}
	const Blueprints = await tRPCAuth.blueprints.myBlueprints.query( { limit: 20 } ).catch( tRPCHandleError );
	const blueprints: BlueprintData[] = Blueprints?.blueprints || [];
	const totalBlueprints: number = Blueprints?.totalBlueprints || 0;

	return json<IndexLoaderData>( { ...result, blueprints, totalBlueprints } );
};
