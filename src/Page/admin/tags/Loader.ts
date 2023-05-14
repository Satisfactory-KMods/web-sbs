import { ERoles } from "@app/Shared/Enum/ERoles";
import { LoginRule, validateLogin } from "@applib/loaderHelper";
import type { LoaderFunction } from "react-router-dom";
import { json } from "react-router-dom";

const loader: LoaderFunction = async( { params, request } ) => {
	const result = await validateLogin( { params, request }, LoginRule.LoggedIn, "/error/401", ERoles.admin );
	if( result instanceof Response ) {
		return result;
	}
	return json<any>( { ...result } );
};

export { loader };

