import DB_BlueprintPacks from "@/server/src/MongoDB/DB_BlueprintPacks";
import DB_Blueprints from "@/server/src/MongoDB/DB_Blueprints";
import type { Tag } from "@server/MongoDB/DB_Tags";
import DB_Tags from "@server/MongoDB/DB_Tags";
import {
	adminProcedure,
	handleTRCPErr,
	router
} from "@server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";


export const admin_tags = router( {
	list: adminProcedure.input( z.object( {
		limit: z.number().optional(),
		skip: z.number().optional()
	} ) ).query( async( { input } ) => {
		const { limit, skip } = input;
		try {
			const data = await DB_Tags.find( {}, {}, { sort: { cratedAt: -1 }, limit, skip } ) as Tag[];
			const count = await DB_Tags.count( {} );
			return { data, count };
		} catch( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} ),

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
			await DB_BlueprintPacks.updateMany( { tags: { $in: [ id ] } }, { $pull: { tags: id } } );
			await DB_Blueprints.updateMany( { tags: { $in: [ id ] } }, { $pull: { tags: id } } );
			return "Tag deleted";
		} catch( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} )
} );
