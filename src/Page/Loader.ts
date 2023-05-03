import type { LoaderDataBase } from "@app/types/loader";
import type { LoaderFunction } from "react-router-dom";
import { json }                from "react-router-dom";
import { validateLogin }       from "@applib/loaderHelper";
import type { MO_Blueprint }   from "@shared/Types/MongoDB";
import {
	tRPC_handleError,
	tRPC_Public
}                              from "@applib/tRPC";

export type IndexLoaderData = LoaderDataBase & {
	blueprints : MO_Blueprint[],
	totalBlueprints : number
}

export const loader : LoaderFunction = async( { params, request } ) => {
	const result = await validateLogin( { params, request } );
	const Blueprints = await tRPC_Public.blueprint.getBlueprints.query( { limit: 10 } ).catch( tRPC_handleError );
	let blueprints : MO_Blueprint[] = [];
	let totalBlueprints = 0;
	if ( Blueprints ) {
		blueprints = Blueprints.blueprints;
		totalBlueprints = Blueprints.totalBlueprints;
	}

	return json<IndexLoaderData>( { ...result, blueprints, totalBlueprints } );
};