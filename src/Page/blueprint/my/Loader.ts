import type { LoaderDataBase } from "@app/Types/loader";
import { validateLogin } from "@applib/loaderHelper";
import {
	tRPC_handleError,
	tRPC_Public
} from "@applib/tRPC";
import type { BlueprintData } from "@server/MongoDB/DB_Blueprints";
import type { LoaderFunction } from "react-router-dom";
import { json } from "react-router-dom";

export type IndexLoaderData = LoaderDataBase & {
	blueprints : BlueprintData[],
	totalBlueprints : number
};

export const loader : LoaderFunction = async( { params, request } ) => {
	const result = await validateLogin( { params, request } );
	if ( result instanceof Response ) {
		return result;
	}
	const Blueprints = await tRPC_Public.blueprint.getBlueprints.query( { limit: 10 } ).catch( tRPC_handleError );
	let blueprints : BlueprintData[] = [];
	let totalBlueprints = 0;
	if ( Blueprints ) {
		blueprints = Blueprints.blueprints;
		totalBlueprints = Blueprints.totalBlueprints;
	}

	return json<IndexLoaderData>( { ...result, blueprints, totalBlueprints } );
};