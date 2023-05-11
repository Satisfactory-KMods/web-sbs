import type { LoaderFunction } from "react-router-dom";
import { json }                from "react-router-dom";
import {
	LoginRule,
	validateLogin
}                              from "@applib/loaderHelper";
import type { LoaderDataBase } from "@app/types/loader";

const loader : LoaderFunction = async( { params, request } ) => {
	const result = await validateLogin( { params, request }, LoginRule.NotLoggedIn, "/" );
	if ( result instanceof Response ) {
		return result;
	}
	return json<LoaderDataBase>( { ...result } );
};

export { loader };