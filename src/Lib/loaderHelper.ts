import type {
	LoaderBlueprintBase,
	LoaderDataBase
}                                  from "@app/Types/loader";
import type { LoaderFunctionArgs } from "@remix-run/router/utils";
import { AUTHTOKEN }               from "@applib/constance";
import { redirect }                from "react-router-dom";
import { tRPC_Public }             from "@applib/tRPC";
import { User }                    from "@shared/Class/User.Class";
import { ERoles }                  from "@shared/Enum/ERoles";

export enum EMustBeLoggedIn {
	NotLoggedIn,
	LoggedIn,
	BlueprintOwner,
	DontCare
}

const validateLogin = async( {
	params,
	request
} : LoaderFunctionArgs, loggedInRule = EMustBeLoggedIn.DontCare, redirectTo = "/error/401", role = ERoles.member ) : Promise<LoaderDataBase> => {
	const token = window.localStorage.getItem( AUTHTOKEN ) || "";
	const Response = await tRPC_Public.validate.query( { token } ).catch( console.warn );

	const loggedIn = !!Response?.tokenValid;
	if ( !loggedIn && loggedInRule === EMustBeLoggedIn.LoggedIn || loggedInRule === EMustBeLoggedIn.BlueprintOwner ) {
		const us = new User( token );
		if ( us.HasPermssion( role ) ) {
			redirect( "/error/401" );
		}
	}
	if ( loggedIn && loggedInRule === EMustBeLoggedIn.LoggedIn || loggedInRule === EMustBeLoggedIn.BlueprintOwner ) {
		redirect( redirectTo );
	}
	if ( loggedIn && loggedInRule === EMustBeLoggedIn.NotLoggedIn ) {
		redirect( redirectTo );
	}

	return { loggedIn, user: new User( token ) };
};

const validateBlueprint = async( {
	params,
	request
} : LoaderFunctionArgs, redirectTo = "/", loggedInRule = EMustBeLoggedIn.DontCare, ownerRedirectTo = "/error/401", role = ERoles.member ) : Promise<LoaderBlueprintBase> => {
	const loaderBase = await validateLogin( { params, request }, loggedInRule, "/error/401", role );
	const { blueprintId } = params;

	const result = await tRPC_Public.blueprint.getBlueprint.query( { blueprintId: blueprintId! } );
	if ( !result ) {
		redirect( redirectTo );
	}

	const blueprintPermission = ( loaderBase.user.Get._id === result.blueprintData.owner || loaderBase.user.HasPermssion( ERoles.admin ) );

	if ( result.blueprintData && loggedInRule === EMustBeLoggedIn.BlueprintOwner ) {
		if ( !loaderBase.user.IsValid || !blueprintPermission ) {
			redirect( ownerRedirectTo );
		}
	}

	return { ...loaderBase, blueprintData: result.blueprintData, blueprintPermission };
};

export { validateLogin };