import DB_SessionToken from "@server/MongoDB/DB_SessionToken";
import {
	authProcedure,
	handleTRCPErr
} from "@server/trpc/trpc";
import { TRPCError } from "@trpc/server";

export const auth_logout = authProcedure.mutation( async( { ctx } ) => {
	const { token } = ctx;

	try {
		await DB_SessionToken.findOneAndDelete( { token } );
		return "Successfully logged out";
	} catch( e ) {
		handleTRCPErr( e );
	}
	throw new TRPCError( { message: "password or login is to short.", code: "BAD_REQUEST" } );
} );