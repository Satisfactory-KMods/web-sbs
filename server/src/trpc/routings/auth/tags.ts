import MongoBlueprintPacks from "@/server/src/MongoDB/MongoBlueprintPacks";
import MongoBlueprints from "@/server/src/MongoDB/MongoBlueprints";
import type { Tag } from "@server/MongoDB/MongoTags";
import MongoTags from "@server/MongoDB/MongoTags";
import {
	adminProcedure,
	handleTRCPErr,
	router
} from "@server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";


export const adminTags = router( {
	list: adminProcedure.input( z.object( {
		limit: z.number().optional(),
		skip: z.number().optional()
	} ) ).query( async( { input } ) => {
		const { limit, skip } = input;
		try {
			const data = await MongoTags.find( {}, {}, { sort: { cratedAt: -1 }, limit, skip } ) as Tag[];
			const count = await MongoTags.count( {} );
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
			await MongoTags.create( { DisplayName } );
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
			await MongoTags.findByIdAndUpdate( id, { DisplayName } );
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
			await MongoTags.findByIdAndDelete( id );
			await MongoBlueprintPacks.updateMany( { tags: { $in: [ id ] } }, { $pull: { tags: id } } );
			await MongoBlueprints.updateMany( { tags: { $in: [ id ] } }, { $pull: { tags: id } } );
			return "Tag deleted";
		} catch( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} )
} );
