import type { LoaderDataBase }     from "@app/types/loader";
import type { LoaderFunctionArgs } from "@remix-run/router/utils";

const validateLogin = async( { params, request } : LoaderFunctionArgs ) : Promise<LoaderDataBase> => {
	const token = window.localStorage.getItem( "session" ) || "";
	//const Response = await tRPC_Public.validate.query( { token } ).catch( console.warn );

	const loggedIn = true;//!!Response?.tokenValid;
	if ( !loggedIn ) {
		window.localStorage.setItem( "session", "" );
	}

	return { loggedIn };
};

const queryBlueprint = async( { params, request } : LoaderFunctionArgs ) : Promise<LoaderDataBase> => {
	const token = window.localStorage.getItem( "session" ) || "";
	//const Response = await tRPC_Public.validate.query( { token } ).catch( console.warn );

	const loggedIn = true;//!!Response?.tokenValid;
	if ( !loggedIn ) {
		window.localStorage.setItem( "session", "" );
	}

	return { loggedIn };
};


export { validateLogin };