import type {
	LoaderBlueprintBase,
	LoaderDataBase
}                                  from "@app/types/loader";
import type { LoaderFunctionArgs } from "@remix-run/router/utils";
import { AUTHTOKEN }               from "@applib/constance";
import { redirect }                from "react-router-dom";
import { tRPC_Public }             from "@applib/tRPC";
import { User }                    from "@shared/Class/User.Class";
import { ERoles }                  from "@shared/Enum/ERoles";

export enum LoginRule {
	NotLoggedIn,
	LoggedIn,
	BlueprintOwner,
	DontCare
}

const validateLogin = async( {
	params,
	request
} : LoaderFunctionArgs, loggedInRule = LoginRule.DontCare, redirectTo = "/error/401", role = ERoles.member ) : Promise<LoaderDataBase | Response> => {
	const token = window.localStorage.getItem( AUTHTOKEN ) || "";
	const Response = await tRPC_Public.validate.query( { token } ).catch( console.warn );

	const loggedIn = !!Response?.tokenValid;
	console.log( loggedIn, loggedInRule );
	if ( !loggedIn && loggedInRule === LoginRule.LoggedIn || loggedInRule === LoginRule.BlueprintOwner ) {
		const us = new User( token );
		if ( us.HasPermssion( role ) ) {
			return redirect( "/error/401" );
		}
	}
	if ( loggedIn && loggedInRule === LoginRule.LoggedIn || loggedInRule === LoginRule.BlueprintOwner ) {
		return redirect( redirectTo );
	}
	if ( loggedIn && loggedInRule === LoginRule.NotLoggedIn ) {
		return redirect( redirectTo );
	}

	return { loggedIn, user: new User( token ) };
};

const validateBlueprint = async( {
	params,
	request
} : LoaderFunctionArgs, redirectTo = "/", loggedInRule = LoginRule.DontCare, ownerRedirectTo = "/error/401", role = ERoles.member ) : Promise<LoaderBlueprintBase | Response> => {
	const loaderBase = await validateLogin( { params, request }, loggedInRule, "/error/401", role );
	if ( loaderBase instanceof Response ) {
		return loaderBase;
	}
	const { blueprintId } = params;

	const result = await tRPC_Public.blueprint.getBlueprint.query( { blueprintId: blueprintId! } );
	if ( !result ) {
		redirect( redirectTo );
	}

	const blueprintPermission = ( loaderBase.user.Get._id === result.blueprintData.owner || loaderBase.user.HasPermssion( ERoles.admin ) );

	if ( result.blueprintData && loggedInRule === LoginRule.BlueprintOwner ) {
		if ( !loaderBase.user.IsValid || !blueprintPermission ) {
			redirect( ownerRedirectTo );
		}
	}

	return { ...loaderBase, blueprintData: result.blueprintData, blueprintPermission };
};

export { validateLogin };