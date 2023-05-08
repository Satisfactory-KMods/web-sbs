import { TRPCError }   from "@trpc/server";
import {
	authProcedure,
	handleTRCPErr
}                      from "@server/trpc/trpc";
import DB_SessionToken from "@server/MongoDB/DB_SessionToken";

export const auth_logout = authProcedure.mutation( async( { ctx } ) => {
	const { token } = ctx;

	try {
		await DB_SessionToken.findOneAndDelete( { token } );
		return "Successfully logged out";
	}
	catch ( e ) {
		handleTRCPErr( e );
	}
	throw new TRPCError( { message: "password or login is to short.", code: "BAD_REQUEST" } );
} );