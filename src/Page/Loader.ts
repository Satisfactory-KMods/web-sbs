import type { LoaderFunction } from "react-router-dom";
import { json }                from "react-router-dom";
import { validateLogin }       from "@applib/loaderHelper";
import {
	tRPC_handleError,
	tRPC_Public
}                              from "@applib/tRPC";
import type { LoaderDataBase } from "@app/types/loader";
import type { Mod }            from "@server/MongoDB/DB_Mods";
import type { Tag }            from "@server/MongoDB/DB_Tags";

export type LayoutLoaderData = LoaderDataBase & {
	mods : Mod[],
	tags : Tag[]
}

export const defaultLoader : LoaderFunction = async( { params, request } ) => {
	const result = await validateLogin( { params, request } );

	const [ mods, tags ] = await Promise.all( [
		tRPC_Public.mods.getMods.query().catch( tRPC_handleError ),
		tRPC_Public.tags.getTags.query().catch( tRPC_handleError )
	] );

	const queryResult = {
		...result,
		mods: [] as Mod[],
		tags: [] as Tag[]
	};

	if ( mods && tags ) {
		queryResult.tags = tags.tags;
		queryResult.mods = mods.mods as any;
	}

	return json<LayoutLoaderData>( queryResult );
};