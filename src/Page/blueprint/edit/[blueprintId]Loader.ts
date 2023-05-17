import { tRPCPublic } from "@app/Lib/tRPC";
import type { LoaderBlueprintBase } from "@app/Types/loader";
import { LoginRule, validateBlueprint } from "@applib/loaderHelper";
import type { Blueprint } from "@etothepii/satisfactory-file-parser";
import type { LoaderFunction } from "react-router-dom";
import { json, redirect } from "react-router-dom";


export type BlueprintIdLoader = LoaderBlueprintBase & {
	blueprint: Blueprint
};

const blueprintIdLoader: LoaderFunction = async( { params, request } ) => {
	const result = await validateBlueprint( { params, request }, "/error/401", LoginRule.BlueprintOwner );
	if( result instanceof Response ) {
		return result;
	}

	const { blueprintId } = params;

	const [ blueprint ] = await Promise.all( [
		tRPCPublic.blueprint.readBlueprint.mutate( { blueprintId: blueprintId! } ).catch( () => null )
	] );

	if( !blueprint || result.blueprintData.blacklisted ) {
		return redirect( "/error/404" );
	}


	return json<BlueprintIdLoader>( { ...result, blueprint } );
};

export { blueprintIdLoader };

