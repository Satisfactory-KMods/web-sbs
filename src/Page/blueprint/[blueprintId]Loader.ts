import type { LoaderBlueprintBase, LoaderDataBase } from "@app/Types/loader";
import { validateBlueprint, validateLogin } from "@applib/loaderHelper";
import type { LoaderFunction } from "react-router-dom";
import { json } from "react-router-dom";

export type IndexLoaderData = LoaderDataBase;

const loader: LoaderFunction = async( { params, request } ) => {
	const result = await validateBlueprint( { params, request }, "/error/404" );
	if( result instanceof Response ) {
		return result;
	}

	return json<LoaderBlueprintBase>( result );
};

export { loader };

