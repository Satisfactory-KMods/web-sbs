import { tRPCAuth, tRPCHandleError } from '@app/Lib/tRPC';
import { ERoles } from "@app/Shared/Enum/ERoles";
import type { LoaderDataBase } from '@app/Types/loader';
import { LoginRule, validateLogin } from "@applib/loaderHelper";
import type { ClientUserAccount } from "@server/MongoDB/MongoUserAccount";
import type { LoaderFunction } from "react-router-dom";
import { json } from "react-router-dom";


export type UserAdminLoaderData = LoaderDataBase & {
	users: ClientUserAccount[],
	totalTags: number
};

const loader: LoaderFunction = async( { params, request } ) => {
	const result = await validateLogin( { params, request }, LoginRule.LoggedIn, "/error/401", ERoles.admin );
	if( result instanceof Response ) {
		return result;
	}
	const response = await tRPCAuth.adminUsers.listUsers.query( { limit: 10 } ).catch( tRPCHandleError );
	const users: ClientUserAccount[] = response?.data || [];
	const totalTags = response?.count || 0;

	return json<UserAdminLoaderData>( { ...result, users, totalTags } );
};

export { loader };

