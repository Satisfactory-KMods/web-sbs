import { CreateSession } from "@server/Lib/Session.Lib";
import DB_UserAccount from "@server/MongoDB/DB_UserAccount";
import {
	handleTRCPErr,
	publicProcedure
} from "@server/trpc/trpc";
import { ERoles } from "@shared/Enum/ERoles";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const public_createAccount =
	publicProcedure.input( z.object( {
		username: z.string().min( 6, { message: "Username is to short." } ),
		email: z.string().email( { message: "Email is invalid." } ),
		password: z.string().min( 8, { message: "Password is to short." } )
	} ) ).mutation<{
		token : string;
		message : string;
	}>( async( { input } ) => {
		const { password, email, username } = input;
		try {
			if ( !await DB_UserAccount.exists( {
				$or: [
					{ username },
					{ email }
				]
			} ) ) {
				const userDocument = new DB_UserAccount();

				userDocument.role = ERoles.member;
				userDocument.username = username;
				userDocument.email = email;
				userDocument.setPassword( password );

				if ( await userDocument.save() ) {
					const token = await CreateSession( userDocument.toJSON() );
					if ( token ) {
						return {
							token: token,
							message: "Account created and logged in successfully!"
						};
					}
					throw new TRPCError( { message: "Error by creating Token!", code: "INTERNAL_SERVER_ERROR" } );
				}
				throw new TRPCError( { message: "User can't saved!", code: "INTERNAL_SERVER_ERROR" } );
			}
		} catch ( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} );