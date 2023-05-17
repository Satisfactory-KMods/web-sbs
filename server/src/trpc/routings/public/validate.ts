import type { UserSession } from "@server/Lib/Session.Lib";
import MongoSessionToken from "@server/MongoDB/MongoSessionToken";
import MongoUserAccount from "@server/MongoDB/MongoUserAccount";
import { publicProcedure } from "@server/trpc/trpc";
import * as jwt from "jsonwebtoken";
import { z } from "zod";

export const publicValidate =
	publicProcedure
		.input( z.object( {
			token: z.string()
		} ) ).query<{
		tokenValid: boolean;
	}>( async( { input } ) => {
		try {
			const result = await jwt.verify( input.token, process.env.JWTToken || "" ) as UserSession;
			const userAccountExsists = !!( await MongoUserAccount.exists( { _id: result._id } ) );
			if( !userAccountExsists ) {
				MongoSessionToken.deleteMany( { userid: result._id } );
			} else {
			}
			return { tokenValid: !!( await MongoSessionToken.exists( { token: input.token } ) ) && userAccountExsists };
		} catch( e ) {  }
		return { tokenValid: false };
	} );