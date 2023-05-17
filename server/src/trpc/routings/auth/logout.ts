import MongoSessionToken from "@server/MongoDB/MongoSessionToken";
import {
	authProcedure,
	handleTRCPErr
} from "@server/trpc/trpc";
import { TRPCError } from "@trpc/server";


export const authLogout = authProcedure.mutation( async( { ctx } ) => {
	const { token } = ctx;

	try {
		await MongoSessionToken.findOneAndDelete( { token } );
		return "Successfully logged out";
	} catch( e ) {
		handleTRCPErr( e );
	}
	throw new TRPCError( { message: "password or login is to short.", code: "BAD_REQUEST" } );
} );
