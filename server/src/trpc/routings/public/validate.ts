import type { UserSession } from "@server/Lib/Session.Lib";
import DB_SessionToken from "@server/MongoDB/DB_SessionToken";
import DB_UserAccount from "@server/MongoDB/DB_UserAccount";
import { publicProcedure } from "@server/trpc/trpc";
import * as jwt from "jsonwebtoken";
import { z } from "zod";

export const public_validate =
	publicProcedure
		.input( z.object( {
			token: z.string()
		} ) ).query<{
		tokenValid : boolean;
	}>( async( { input } ) => {
		try {
			const result = await jwt.verify( input.token, process.env.JWTToken || "" ) as UserSession;
			const userAccountExsists = !!( await DB_UserAccount.exists( { _id: result._id } ) );
			if ( !userAccountExsists ) {
				DB_SessionToken.deleteMany( { userid: result._id } );
			}
			return { tokenValid: !!( await DB_SessionToken.exists( { token: input.token } ) ) && userAccountExsists };
		} catch ( e ) {
		}
		return { tokenValid: false };
	} );