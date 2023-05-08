import type { LoaderFunction } from "react-router-dom";
import { json }                from "react-router-dom";
import { validateLogin }       from "@applib/loaderHelper";
import type { LoaderDataBase } from "@app/types/loader";

export type IndexLoaderData = LoaderDataBase

export const loader : LoaderFunction = async( { params, request } ) => {
	const result = await validateLogin( { params, request } );
	return json<IndexLoaderData>( { ...result } );
};

export { loader };