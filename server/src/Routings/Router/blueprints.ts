import { upload } from "@/server/src/Lib/Multer.Lib";
import type { User } from "@/src/Shared/Class/User.Class";
import { ERoles } from "@/src/Shared/Enum/ERoles";
import { dataResponse, errorResponse } from "@kyri123/lib";
import { BlueprintParser } from "@server/Lib/BlueprintParser";
import {
	ApiUrl,
	MWAuth
} from "@server/Lib/Express.Lib";
import type { BlueprintData } from "@server/MongoDB/MongoBlueprints";
import MongoBlueprints from "@server/MongoDB/MongoBlueprints";
import type { ExpressRequest } from "@server/Types/express";
import { EApiBlueprintUtils } from "@shared/Enum/EApiPath";
import type {
	Response
} from "express";
import fs from "fs";
import Jimp from "jimp";
import _ from "lodash";
import path from "path";
import { z } from "zod";


export default function() {
	Router.post( ApiUrl( EApiBlueprintUtils.parseblueprint ), MWAuth, upload.array( "blueprint", 2 ), async( req: ExpressRequest<{
		blueprintName: string
	}>, res: Response ) => {
		if( req.files && Array.isArray( req.files ) && Number( req.files.length ) === 2 ) {
			try {
				// test if we rly get a string
				z.string().parse( req.body.blueprintName );

				let SBP: Buffer = Buffer.from( "" );
				let SBPCFG: Buffer = Buffer.from( "" );

				for( const file of req.files ) {
					const filePath = path.join( file.destination, file.filename );
					if( file.originalname.endsWith( ".sbp" ) ) {
						SBP = fs.readFileSync( filePath );
					} else if( file.originalname.endsWith( ".sbpcfg" ) ) {
						SBPCFG = fs.readFileSync( filePath );
					}
					fs.rmSync( filePath );
				}

				const Blueprint = new BlueprintParser( req.body.blueprintName, SBP, SBPCFG );
				if( Blueprint.Success ) {
					return res.status( 200 ).json( dataResponse( Blueprint.Get ) );
				}
			} catch( e ) {
				if( e instanceof Error ) {
					SystemLib.LogError( "api", e.message );
				}
			}
		}

		return res.status( 500 ).json( errorResponse( "Something goes wrong!", res ) );
	} );


	Router.post( ApiUrl( EApiBlueprintUtils.create ), MWAuth, upload.fields( [ { name: 'sbp', maxCount: 1 }, { name: 'sbpcfg', maxCount: 1 }, { name: 'images', maxCount: 5 } ] ), async( req: ExpressRequest<{
		blueprint: Omit<BlueprintData, "_id" | "__v"> | string,
		UserClass: User
	}>, res: Response ) => {
		try {
			if( typeof req.body.blueprint === "string" ) {
				req.body.blueprint = JSON.parse( req.body.blueprint );
			}
			const blueprint = new MongoBlueprints( req.body.blueprint );
			blueprint.totalRating = 0;
			blueprint.downloads = 0;
			blueprint.totalRatingCount = 0;
			blueprint.rating = [];
			blueprint.images = [];

			if( req.files && !Array.isArray( req.files ) ) {
				const id = blueprint._id.toString();
				const blueprintDir = path.join( __BlueprintDir, id );
				fs.mkdirSync( blueprintDir, { recursive: true } );
				blueprint.originalName = req.files.sbp[ 0 ].originalname.replace( ".sbp", "" );
				fs.renameSync( req.files.sbp[ 0 ].path, path.join( blueprintDir, `${ id }.sbp` ) );
				fs.renameSync( req.files.sbpcfg[ 0 ].path, path.join( blueprintDir, `${ id }.sbpcfg` ) );
				let idx = 0;
				for( const file of req.files.images ) {
					if( file.mimetype && file.mimetype.split( "/" )[ 0 ] === "image" && file.mimetype.split( "/" )[ 1 ] ) {
						const newName = `image_${ id }_${ idx }.jpg`;
						const image = await Jimp.read( file.path );
						image.resize( 512 * 1.5, 288 * 1.5 ).quality( 80 ).write( path.join( blueprintDir, newName ) );
						fs.rmSync( file.path );
						blueprint.images.push( newName );
						idx++;
					}
				}

				if( await MongoBlueprints.exists( { originalName: blueprint.originalName } ) ) {
					fs.rmSync( blueprintDir, { recursive: true } );
					return res.status( 500 ).json( errorResponse( "Blueprint with this name is allready in our Database. Please use a other filename!", res ) );
				}

				if( await blueprint.save() ) {
					await blueprint.updateBlueprintData();
					return res.status( 200 ).json( dataResponse( {
						msg: "Blueprint created successfully",
						blueprintId: id
					} ) );
				}
			}
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( "api", e.message );
			}
		}

		return res.status( 500 ).json( errorResponse( "Something goes wrong!", res ) );
	} );

	Router.post( ApiUrl( EApiBlueprintUtils.edit ), upload.fields( [ { name: 'sbp', maxCount: 1 }, { name: 'sbpcfg', maxCount: 1 }, { name: 'images', maxCount: 5 } ] ), MWAuth, async( req: ExpressRequest<{
		blueprint: Omit<BlueprintData, "_id" | "__v">,
		blueprintId: string,
		UserClass: User
	}>, res: Response ) => {
		try {
			if( typeof req.body.blueprint === "string" ) {
				req.body.blueprint = JSON.parse( req.body.blueprint );
			}
			const blueprint = await MongoBlueprints.findById( req.body.blueprintId );
			if( !blueprint ) {
				return res.status( 404 ).json( errorResponse( "Blueprint not found!", res ) );
			}
			if( !( _.isEqual( req.body.UserClass.Get._id, blueprint.owner.toString() ) || req.body.UserClass.HasPermission( ERoles.moderator ) ) ) {
				return res.status( 401 ).json( errorResponse( "Unauthorized", res ) );
			}

			blueprint.name = req.body.blueprint.name;
			blueprint.description = req.body.blueprint.description;
			blueprint.tags = req.body.blueprint.tags;
			blueprint.mods = req.body.blueprint.mods;
			blueprint.DesignerSize = req.body.blueprint.DesignerSize;

			blueprint.markModified( "name" );
			blueprint.markModified( "description" );
			blueprint.markModified( "tags" );
			blueprint.markModified( "mods" );
			blueprint.markModified( "DesignerSize" );

			if( req.files && !Array.isArray( req.files ) ) {
				const id = blueprint._id.toString();
				const blueprintDir = path.join( __BlueprintDir, id );
				fs.mkdirSync( blueprintDir, { recursive: true } );

				if( req.files.sbp && req.files.sbpcfg ) {
					fs.existsSync( path.join( blueprintDir, `${ id }.sbp` ) ) && fs.rmSync( path.join( blueprintDir, `${ id }.sbp` ), { recursive: true } );
					fs.existsSync( path.join( blueprintDir, `${ id }.sbp` ) ) && fs.rmSync( path.join( blueprintDir, `${ id }.sbpcfg` ), { recursive: true } );
					blueprint.originalName = req.files.sbp[ 0 ].originalname.replace( ".sbp", "" );
					blueprint.markModified( "originalName" );
					fs.renameSync( req.files.sbp[ 0 ].path, path.join( blueprintDir, `${ id }.sbp` ) );
					fs.renameSync( req.files.sbpcfg[ 0 ].path, path.join( blueprintDir, `${ id }.sbpcfg` ) );
				}
				if( req.files.images ) {
					let idx = 0;
					blueprint.images = [];
					for( const file of fs.readdirSync( blueprintDir ) ) {
						if( file.startsWith( "image_" ) ) {
							fs.rmSync( path.join( blueprintDir, file ), { recursive: true } );
						}
					}
					for( const file of req.files.images ) {
						if( file.mimetype && file.mimetype.split( "/" )[ 0 ] === "image" && file.mimetype.split( "/" )[ 1 ] ) {
							const newName = `image_${ id }_${ idx }.jpg`;
							const image = await Jimp.read( file.path );
							image.resize( 512 * 1.5, 288 * 1.5 ).quality( 80 ).write( path.join( blueprintDir, newName ) );
							fs.rmSync( file.path );
							blueprint.images.push( newName );
							idx++;
						}
					}
					blueprint.markModified( "images" );
				}
			}

			if( await blueprint.save() ) {
				await blueprint.updateBlueprintData();
				return res.status( 200 ).json( dataResponse( {
					msg: "Blueprint edited successfully",
					blueprintId: blueprint._id.toString()
				} ) );
			}
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( "api", e.message );
			}
		}

		return res.status( 500 ).json( errorResponse( "Something goes wrong!", res ) );
	} );
}
