import { ApiUrl, MWRest, MWRestUser } from "@/server/src/Lib/Express.Lib";
import type { BlueprintDataExtended, BlueprintPackExtended } from "@/server/src/MongoDB/MongoBlueprints";
import MongoBlueprints, { MongoBlueprintPacks } from "@/server/src/MongoDB/MongoBlueprints";
import MongoTags from "@/server/src/MongoDB/MongoTags";
import type { UserAccount } from "@/server/src/MongoDB/MongoUserAccount";
import type { ExpressRequest } from "@/server/src/Types/express";
import { buildFilter, filterSchema } from "@/server/src/trpc/routings/public/blueprint";
import type { Response } from "express";
import type { HydratedDocument } from "mongoose";
import { z } from "zod";
import type { IconData } from './../../MongoDB/MongoBlueprints';


interface BlueprintPackModData {
	_id: string,
	name: string,
	mods: string[],
	tags: {
		_id: string,
		DisplayName: string
	}[],
	owner: string,
	image: string,
	createdAt: Date | string,
	updatedAt: Date | string,
	blueprints: {
		_id: string,
		originalName: string,
		name: string,
		iconData: IconData
	}[],
	totalRating: number,
	totalRatingCount: number
}


interface BlueprintModData {
	_id: string,
	name: string,
	mods: string[],
	tags: {
		_id: string,
		DisplayName: string
	}[],
	originalName: string,
	owner: string,
	downloads: number,
	DesignerSize: string,
	createdAt: Date | string,
	updatedAt: Date | string,
	totalRating: number,
	totalRatingCount: number,
	images: string[],
	iconData: IconData
}


export default function() {
	Router.post( ApiUrl( "mod/getblueprints" ), MWRest, async( req: ExpressRequest<{
		skip: number,
		limit: number,
		filterOptions: z.infer<typeof filterSchema>
	}>, res: Response ) => {
		try {
			z.number().optional().parse( req.body.skip );
			z.number().parse( req.body.limit );
			filterSchema.optional().parse( req.body.filterOptions );

			const { skip, limit, filterOptions } = req.body;

			const { filter, options } = buildFilter( filterOptions );
			const totalBlueprints = await MongoBlueprints.count( filter );
			const blueprints: BlueprintModData[] = [];
			for await ( const blueprint of MongoBlueprints.find<HydratedDocument<BlueprintDataExtended>>( filter, { description: 0 }, { skip, limit, options, populate: [ { path: "owner", select: '-hash -apiKey -salt' }, { path: 'tags' } ] } ) ) {
				blueprints.push( {
					_id: blueprint._id.toString(),
					name: blueprint.name,
					mods: blueprint.mods,
					tags: blueprint.tags.map( e => ( { DisplayName: e.DisplayName, _id: e._id.toString() } ) ),
					originalName: blueprint.originalName,
					owner: blueprint.owner.username,
					downloads: blueprint.downloads,
					DesignerSize: blueprint.DesignerSize as string,
					createdAt: blueprint.createdAt,
					updatedAt: blueprint.updatedAt,
					totalRating: blueprint.totalRating,
					totalRatingCount: blueprint.totalRatingCount,
					images: blueprint.images,
					iconData: blueprint.iconData!
				} );
			}

			SystemLib.DebugLog( "return bp", blueprints.length, totalBlueprints );
			return res.json( { blueprints, totalBlueprints } );
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( "api", e.message );
			}
		}

		return res.sendStatus( 500 );
	} );


	Router.post( ApiUrl( "mod/gettags" ), MWRest, async( req: ExpressRequest, res: Response ) => {
		try {
			const tags = await MongoTags.find();
			return res.json( { tags: tags.map( e => ( { _id: e._id.toString(), DisplayName: e.DisplayName } ) ) } );
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( "api", e.message );
			}
		}

		return res.sendStatus( 500 );
	} );


	Router.post( ApiUrl( "mod/getblueprintpacks" ), MWRest, async( req: ExpressRequest<{
		skip: number,
		limit: number,
		filterOptions: z.infer<typeof filterSchema>
	}>, res: Response ) => {
		try {
			z.number().optional().parse( req.body.skip );
			z.number().parse( req.body.limit );
			filterSchema.optional().parse( req.body.filterOptions );

			const { skip, limit, filterOptions } = req.body;

			const { filter, options } = buildFilter( filterOptions );
			const totalBlueprints = await MongoBlueprintPacks.count( filter );
			const blueprints: BlueprintPackModData[] = [];
			for await ( const blueprintPack of MongoBlueprintPacks.find<HydratedDocument<BlueprintPackExtended>>( filter, { description: 0 }, { skip, limit, options } ).populate( [ { path: "owner", select: '-hash -apiKey -salt' }, 'blueprints', 'tags' ] ) ) {
				blueprints.push( {
					_id: blueprintPack._id.toString(),
					name: blueprintPack.name,
					mods: blueprintPack.mods,
					tags: blueprintPack.tags.map( e => ( { DisplayName: e.DisplayName, _id: e._id.toString() } ) ),
					owner: blueprintPack.owner._id.toString(),
					createdAt: blueprintPack.createdAt,
					updatedAt: blueprintPack.updatedAt,
					blueprints: blueprintPack.blueprints.map( e => ( {
						_id: e._id.toString(),
						originalName: e.originalName,
						name: e.name,
						iconData: e.iconData!
					} ) ),
					totalRating: blueprintPack.totalRating,
					totalRatingCount: blueprintPack.totalRatingCount,
					image: blueprintPack.blueprints[ 0 ].images[ 0 ]
				} );
			}

			return res.json( { blueprints, totalBlueprints } );
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( "api", e.message );
			}
		}

		return res.sendStatus( 500 );
	} );

	Router.post( ApiUrl( "mod/authcheck" ), MWRest, MWRestUser, async( req: ExpressRequest<{ user: UserAccount }>, res: Response ) => res.status( 200 ).json( {
		success: true,
		user: {
			_id: req.body.user._id.toString(),
			username: req.body.user.username,
			role: req.body.user.role
		}
	} ) );
}

