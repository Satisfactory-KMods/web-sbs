import { tRPC_Auth, tRPC_handleError } from "@app/Lib/tRPC";
import { ERoles } from "@app/Shared/Enum/ERoles";
import type { LoaderDataBase } from "@app/Types/loader";
import { LoginRule, validateLogin } from "@applib/loaderHelper";
import type { LoaderFunction } from "react-router-dom";
import { json } from "react-router-dom";
import type { Tag } from './../../../../server/src/MongoDB/DB_Tags';

export type TagAdminLoaderData = LoaderDataBase & {
	tags: Tag[],
	totalTags: number
};

const loader: LoaderFunction = async( { params, request } ) => {
	const result = await validateLogin( { params, request }, LoginRule.LoggedIn, "/error/401", ERoles.admin );
	if( result instanceof Response ) {
		return result;
	}
	const response = await tRPC_Auth.adminTags.list.query( { limit: 10 } ).catch( tRPC_handleError );
	const tags: Tag[] = response?.data || [];
	const totalTags = response?.count || 0;

	return json<TagAdminLoaderData>( { ...result, tags, totalTags } );
};

export { loader };

