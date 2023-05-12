import DB_SessionToken from "@server/MongoDB/DB_SessionToken";
import DB_UserAccount from "@server/MongoDB/DB_UserAccount";
import {
	handleTRCPErr,
	publicProcedure
} from "@server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import _ from "lodash";
import { z } from "zod";

export const auth_updateAccount =
	publicProcedure.input( z.object( {
		username: z.string().min( 6, { message: "Username is to short." } ).optional(),
		email: z.string().email( { message: "Email is invalid." } ).optional(),
		password: z.string().min( 8, { message: "Password is to short." } ).optional()
	} ) ).mutation( async( { input, ctx } ) => {
		const { userClass } = ctx;
		const { password, email, username } = input;
		try {
			const userDocument = await DB_UserAccount.findById( userClass.Get._id );
			if ( userDocument ) {
				if ( username && !_.isEqual( username, userClass.Get.username ) && await DB_UserAccount.exists( { username } ) ) {
					throw new TRPCError( {
						message: "An account with this username already exists and cant be used.",
						code: "BAD_REQUEST"
					} );
				}

				if ( email && !_.isEqual( email, userClass.Get.email ) && await DB_UserAccount.exists( { email } ) ) {
					throw new TRPCError( {
						message: "An account with this e-mail already exists and cant be used.",
						code: "BAD_REQUEST"
					} );
				}

				( username && !_.isEqual( username, userClass.Get.username ) ) && ( userDocument.username = username );
				( email && !_.isEqual( email, userClass.Get.email ) ) && ( userDocument.email = email );
				password && userDocument.setPassword( password );

				if ( await userDocument.save() ) {
					await DB_SessionToken.deleteMany( { userid: userClass.Get._id } );
					return "Account created you will logged out!";
				}
			}
			throw new TRPCError( { message: "User not found!", code: "INTERNAL_SERVER_ERROR" } );
		} catch ( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} );