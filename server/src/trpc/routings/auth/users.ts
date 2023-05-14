import type { ClientUserAccount } from "@/server/src/MongoDB/DB_UserAccount";
import DB_UserAccount from "@/server/src/MongoDB/DB_UserAccount";
import { ERoles } from "@/src/Shared/Enum/ERoles";
import {
	adminProcedure,
	handleTRCPErr,
	router
} from "@server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";


export const admin_users = router( {
	listUsers: adminProcedure.input( z.object( {
		limit: z.number().optional(),
		skip: z.number().optional()
	} ) ).query( async( { input } ) => {
		const { limit, skip } = input;
		try {
			const data = await DB_UserAccount.find( {}, { salt:0, hash:0, email:0 }, { sort: { cratedAt: -1 }, limit, skip } ) as ClientUserAccount[];
			const count = await DB_UserAccount.count( {} );
			return { data, count };
		} catch( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} ),

	setRole: adminProcedure.input( z.object( {
		id: z.string(),
		role: z.nativeEnum( ERoles )
	} ) ).mutation( async( { input } ) => {
		const { role, id } = input;
		try {
			await DB_UserAccount.findByIdAndUpdate( id, { role } );
			return "User modified";
		} catch( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} ),

	delete: adminProcedure.input( z.object( {
		id: z.string()
	} ) ).mutation( async( { input } ) => {
		const { id } = input;
		try {
			await DB_UserAccount.findByIdAndDelete( id );
			return "User deleted";
		} catch( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} )
} );
