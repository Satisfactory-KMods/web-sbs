import type { LoaderBlueprintBase, LoaderDataBase } from "@app/Types/loader";
import { AUTHTOKEN } from "@applib/constance";
import { tRPCPublic } from "@applib/tRPC";
import type { LoaderFunctionArgs } from "@remix-run/router/utils";
import type { BlueprintPackExtended } from "@server/MongoDB/MongoBlueprints";
import { User } from "@shared/Class/User.Class";
import { ERoles } from "@shared/Enum/ERoles";
import { redirect } from "react-router-dom";


export interface BlueprintPackDefaultLoader extends LoaderDataBase {
	blueprintPack: BlueprintPackExtended
}

export enum LoginRule {
	NotLoggedIn,
	LoggedIn,
	BlueprintOwner,
	DontCare
}

const validateLogin = async( {
	params,
	request
}: LoaderFunctionArgs, loggedInRule = LoginRule.DontCare, redirectTo = "/error/401", role?: ERoles ): Promise<LoaderDataBase | Response> => {
	const token = window.localStorage.getItem( AUTHTOKEN ) || "";
	const Response = await tRPCPublic.validate.query( { token } ).catch( console.error );

	const loggedIn = !!Response?.tokenValid;

	if( !loggedIn && !!role ) {
		return redirect( redirectTo );
	}

	if( loggedIn && !!role ) {
		const us = new User( token );
		if( !us.HasPermission( role ) ) {
			return redirect( "/error/401" );
		}
	}

	if( !loggedIn && loggedInRule === ( LoginRule.LoggedIn || loggedInRule === LoginRule.BlueprintOwner ) ) {
		return redirect( redirectTo );
	}

	if( loggedIn && loggedInRule === LoginRule.NotLoggedIn ) {
		return redirect( redirectTo );
	}

	return { loggedIn, user: new User( token ) };
};

const validateBlueprint = async( {
	params,
	request
}: LoaderFunctionArgs, redirectTo = "/", loggedInRule = LoginRule.DontCare, ownerRedirectTo = "/error/401", role = ERoles.member ): Promise<LoaderBlueprintBase | Response> => {
	const loaderBase = await validateLogin( { params, request }, loggedInRule, "/error/401", role );
	if( loaderBase instanceof Response ) {
		return loaderBase;
	}
	const { blueprintId } = params;
	const blueprintOwner = { id: "", username: "" };

	const result = await tRPCPublic.blueprint.getBlueprint.query( { blueprintId: blueprintId! } );
	if( !result ) {
		redirect( redirectTo );
	}

	blueprintOwner.id = result.blueprintData.owner as string;
	blueprintOwner.username = result.bpOwnerName;

	const blueprintPermission = ( loaderBase.user.Get._id === result.blueprintData.owner || loaderBase.user.HasPermission( ERoles.admin ) );

	if( result.blueprintData && loggedInRule === LoginRule.BlueprintOwner ) {
		if( !loaderBase.user.IsValid || !blueprintPermission ) {
			redirect( ownerRedirectTo );
		}
	}

	return { ...loaderBase, blueprintData: result.blueprintData, blueprintPermission, blueprintOwner };
};

const validateBlueprintPack = async( {
	params,
	request
}: LoaderFunctionArgs, redirectTo = "/", loggedInRule = LoginRule.DontCare, ownerRedirectTo = "/error/401", role = ERoles.member ): Promise<BlueprintPackDefaultLoader | Response> => {
	const loaderBase = await validateLogin( { params, request }, loggedInRule, "/error/401", role );
	if( loaderBase instanceof Response ) {
		return loaderBase;
	}
	const { blueprintPackId } = params;

	const result: BlueprintPackExtended | null = await tRPCPublic.blueprintPacks.getBlueprintPack.query( { blueprintPackId: blueprintPackId! } );
	if( !result ) {
		redirect( redirectTo );
	}

	const blueprintPermission = ( loaderBase.user.Get._id === result.owner._id || loaderBase.user.HasPermission( ERoles.admin ) );

	if( loggedInRule === LoginRule.BlueprintOwner ) {
		if( !loaderBase.user.IsValid || !blueprintPermission ) {
			redirect( ownerRedirectTo );
		}
	}

	return { ...loaderBase, blueprintPack: result };
};

export { validateLogin, validateBlueprint, validateBlueprintPack };

