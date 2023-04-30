import { z }             from "zod";
import { TRPCError }     from "@trpc/server";
import {
	handleTRCPErr,
	publicProcedure
}                        from "@server/trpc/trpc";
import DB_UserAccount    from "@server/MongoDB/DB_UserAccount";
import { CreateSession } from "@server/Lib/Session.Lib";

export const public_login = publicProcedure.input( z.object( {
	login: z.string().min( 6, { message: "Username is to short." } ),
	password: z.string().min( 8, { message: "Password is to short." } ),
	stayLoggedIn: z.boolean()
} ) ).mutation<{
	token : string;
	message : string;
}>( async( { input } ) => {
	const { login, password, stayLoggedIn } = input;

	try {
		if ( password.length >= 8 && login.length >= 6 ) {
			const userDocument = await DB_UserAccount.findOne( {
				$or: [
					{ email: login },
					{ username: login }
				]
			} );
			if ( userDocument ) {
				if ( userDocument.validPassword( password ) ) {
					const token = await CreateSession( userDocument.toJSON(), stayLoggedIn );
					if ( token ) {
						return { token, message: `Login successfully, Welcome ${ userDocument.username }` };
					}
					throw new TRPCError( {
						message: "Something goes wrong while creating token.",
						code: "INTERNAL_SERVER_ERROR"
					} );
				}
				throw new TRPCError( { message: "password is incorrect.", code: "BAD_REQUEST" } );
			}
			throw new TRPCError( { message: "password is incorrect.", code: "BAD_REQUEST" } );
		}
	}
	catch ( e ) {
		handleTRCPErr( e );
	}
	throw new TRPCError( { message: "password or login is to short.", code: "BAD_REQUEST" } );
} );