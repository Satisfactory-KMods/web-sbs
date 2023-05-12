import type { LoaderDataBase } from "@app/Types/loader";
import {
	LoginRule,
	validateLogin
} from "@applib/loaderHelper";
import type { LoaderFunction } from "react-router-dom";
import { json } from "react-router-dom";

export type IndexLoaderData = LoaderDataBase;

const loader : LoaderFunction = async( { params, request } ) => {
	const result = await validateLogin( { params, request }, LoginRule.LoggedIn );
	if ( result instanceof Response ) {
		return result;
	}
	return json<IndexLoaderData>( { ...result } );
};

export { loader };

