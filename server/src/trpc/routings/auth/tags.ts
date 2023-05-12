import DB_Tags from "@server/MongoDB/DB_Tags";
import {
	adminProcedure,
	handleTRCPErr,
	router
} from "@server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";


export const admin_tags = router( {
	create: adminProcedure.input( z.object( {
		DisplayName: z.string()
	} ) ).mutation( async( { input } ) => {
		const { DisplayName } = input;
		try {
			await DB_Tags.create( { DisplayName } );
			return "Tag created";
		} catch( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} ),

	edit: adminProcedure.input( z.object( {
		id: z.string(),
		DisplayName: z.string()
	} ) ).mutation( async( { input } ) => {
		const { DisplayName, id } = input;
		try {
			await DB_Tags.findByIdAndUpdate( id, { DisplayName } );
			return "Tag modified";
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
			await DB_Tags.findByIdAndDelete( id );
			return "Tag deleted";
		} catch( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} )
} );
