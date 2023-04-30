import type { LoaderDataBase } from "@app/types/loader";
import type {
	LoaderFunction} from "react-router-dom";
import {
	json,
	redirect
}                         from "react-router-dom";
import { validateLogin }  from "@applib/loaderHelper";

export type IndexLoaderData = LoaderDataBase

export const loader : LoaderFunction = async( { params, request } ) => {
	const result = await validateLogin( { params, request } );
	if ( !result.loggedIn ) {
		return redirect( "/login" );
	}

	return json<IndexLoaderData>( result );
};