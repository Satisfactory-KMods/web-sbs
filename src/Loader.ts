import type { LoaderDataBase } from "@app/types/loader";
import type { LoaderFunction } from "react-router-dom";
import { json }                from "react-router-dom";
import { validateLogin }       from "@applib/loaderHelper";
import {
	tRPC_handleError,
	tRPC_Public
}                              from "@applib/tRPC";
import type {
	MO_Mod,
	MO_Tag
}                              from "@shared/Types/MongoDB";

export type LayoutLoaderData = LoaderDataBase & {
	mods : MO_Mod[],
	tags : MO_Tag[]
}

export const defaultLoader : LoaderFunction = async( { params, request } ) => {
	const result = await validateLogin( { params, request } );

	const [ mods, tags ] = await Promise.all( [
		tRPC_Public.mods.getMods.query().catch( tRPC_handleError ),
		tRPC_Public.tags.getTags.query().catch( tRPC_handleError )
	] );

	const queryResult = {
		...result,
		mods: [] as MO_Mod[],
		tags: [] as MO_Tag[]
	};

	if ( mods && tags ) {
		queryResult.tags = tags.tags;
		queryResult.mods = mods.mods as any;
	}

	return json<LayoutLoaderData>( queryResult );
};