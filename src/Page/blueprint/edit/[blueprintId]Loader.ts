import { tRPC_Public } from "@app/Lib/tRPC";
import type { IndexLoaderData } from "@app/Page/blueprint/[blueprintId]Loader";
import type { LoaderBlueprintBase } from "@app/Types/loader";
import { validateBlueprint } from "@applib/loaderHelper";
import type { Blueprint } from "@etothepii/satisfactory-file-parser";
import type { LoaderFunction } from "react-router-dom";
import { json, redirect } from "react-router-dom";

export type BlueprintIdLoader = LoaderBlueprintBase & {
	blueprint: Blueprint
};

const blueprintIdLoader: LoaderFunction = async( { params, request } ) => {
	const result = await validateBlueprint( { params, request } );
	if( result instanceof Response ) {
		return result;
	}

	const { blueprintId } = params;

	const [ blueprint ] = await Promise.all( [
		tRPC_Public.blueprint.readBlueprint.mutate( { blueprintId: blueprintId! } ).catch( () => null )
	] );

	if( !blueprint ) {
		return redirect( "/error/404" );
	}


	return json<BlueprintIdLoader>( { ...result, blueprint } );
};

export { blueprintIdLoader };

