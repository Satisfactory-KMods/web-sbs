import type { LoaderDataBase } from "@app/Types/loader";
import {
	LoginRule,
	validateLogin
} from "@applib/loaderHelper";
import type { LoaderFunction } from "react-router-dom";
import { json } from "react-router-dom";


const loader: LoaderFunction = async( { params, request } ) => {
	const result = await validateLogin( { params, request }, LoginRule.LoggedIn, "/account/signin" );
	if( result instanceof Response ) {
		return result;
	}
	return json<LoaderDataBase>( { ...result } );
};

export { loader };

