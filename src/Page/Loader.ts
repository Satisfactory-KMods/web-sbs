import type { LoaderDataBase } from "@app/Types/loader";
import { validateLogin } from "@applib/loaderHelper";
import {
	tRPCHandleError,
	tRPCPublic
} from "@applib/tRPC";
import type { Mod } from "@server/MongoDB/MongoMods";
import type { Tag } from "@server/MongoDB/MongoTags";
import type { LoaderFunction } from "react-router-dom";
import { json } from "react-router-dom";

export type LayoutLoaderData = LoaderDataBase & {
	mods: Mod[],
	tags: Tag[]
};

export const defaultLoader: LoaderFunction = async( { params, request } ) => {
	const result = await validateLogin( { params, request } );
	if( result instanceof Response ) {
		return result;
	}

	const [ mods, tags ] = await Promise.all( [
		tRPCPublic.mods.getMods.query().catch( tRPCHandleError ),
		tRPCPublic.tags.getTags.query().catch( tRPCHandleError )
	] );

	const queryResult = {
		...result,
		mods: [] as Mod[],
		tags: [] as Tag[]
	};

	if( mods && tags ) {
		queryResult.tags = tags;
		queryResult.mods = mods;
	}

	return json<LayoutLoaderData>( queryResult );
};