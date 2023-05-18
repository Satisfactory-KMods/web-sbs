import { tRPCPublic } from "@app/Lib/tRPC";
import type { BlueprintIdLoader } from "@app/Page/blueprint/edit/[blueprintId]Loader";
import { validateBlueprint } from "@applib/loaderHelper";
import type { LoaderFunction } from "react-router-dom";
import { json, redirect } from "react-router-dom";


const loader: LoaderFunction = async( { params, request } ) => {
	const result = await validateBlueprint( { params, request }, "/error/404" );
	if( result instanceof Response ) {
		return result;
	}

	const { blueprintId } = params;

	const [ blueprint ] = await Promise.all( [
		tRPCPublic.blueprint.readBlueprint.mutate( { blueprintId: blueprintId! } ).catch( () => null )
	] );

	if( !blueprint ) {
		return redirect( "/error/404" );
	}

	return json<BlueprintIdLoader>( { ...result, blueprint } );
};

export { loader };

