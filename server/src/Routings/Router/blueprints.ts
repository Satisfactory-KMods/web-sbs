import type { BlueprintClass } from "@/server/src/Lib/Blueprint.Class";
import { dataResponse, errorResponse } from "@kyri123/lib";
import { BlueprintParser } from "@server/Lib/BlueprintParser";
import {
	ApiUrl,
	MW_Auth,
	upload
} from "@server/Lib/Express.Lib";
import type { BlueprintData } from "@server/MongoDB/DB_Blueprints";
import type { ExpressRequest } from "@server/Types/express";
import { EApiBlueprintUtils, EApiUserBlueprints } from "@shared/Enum/EApiPath";
import type {
	Response
} from "express";
import fs from "fs";
import { z } from "zod";

export default function() {
	Router.post( ApiUrl( EApiBlueprintUtils.parseblueprint ), upload.array( 'blueprint', 2 ), upload.fields( [ { name: 'sbp', maxCount: 1 }, { name: 'sbpcfg', maxCount: 1 }, { name: 'images', maxCount: 5 } ] ), MW_Auth, async( req: ExpressRequest<{
		blueprintName: string
	}>, res: Response ) => {
		if( req.files && Array.isArray( req.files ) && Number( req.files.length ) >= 2 ) {
			try {
				// test if we rly get a string
				z.string().parse( req.body.blueprintName );

				let SBP: Buffer = Buffer.from( "" );
				let SBPCFG: Buffer = Buffer.from( "" );

				for( const file of req.files ) {
					if( file.filename.endsWith( ".sbp" ) ) {
						SBP = fs.readFileSync( file.path );
					} else if( file.filename.endsWith( ".sbpcfg" ) ) {
						SBPCFG = fs.readFileSync( file.path );
					}
					fs.rmSync( file.path );
					console.log( "ParseBlueprint delete file:", file.path );
				}

				const Blueprint = new BlueprintParser( req.body.blueprintName, SBP, SBPCFG );
				if( Blueprint.Success ) {
					return res.status( 200 ).json( dataResponse( Blueprint.Get ) );
				}
			} catch( e ) {
				if( e instanceof Error ) {
					SystemLib.LogError( e.message );
				}
			}
		}

		return res.status( 500 ).json( errorResponse( "Something goes wrong!", res ) );
	} );


	Router.post( ApiUrl( EApiUserBlueprints.create ), upload.fields( [ { name: 'sbp', maxCount: 1 }, { name: 'sbpcfg', maxCount: 1 }, { name: 'images', maxCount: 5 } ] ), MW_Auth, async( req: ExpressRequest<{
		blueprint: Omit<BlueprintData, "_id" | "__v">,
		blueprintName: string
	}>, res: Response ) => {
		/*
		const Response: TResponse_BPUser_Create = {
			...DefaultResponseFailed
		};

		const Request = req.body;
		const Files = req.files as TRequest_BPUser_Create_Files;

		try {
			if( Request.BlueprintName && Request.BlueprintDesc && Request.UserClass && Request.DesignerSize ) {
				if( Files.SBP && Files.SBPCFG && Files.Image ) {
					const Blueprint = new DB_Blueprints();
					Blueprint.description = Request.BlueprintDesc;
					Blueprint.name = Request.BlueprintName;
					Blueprint.tags = Request.BlueprintTags || [];
					Blueprint.mods = Request.BlueprintMods || [];
					Blueprint.owner = Request.UserClass.Get._id;
					Blueprint.DesignerSize = Request.DesignerSize;
					const ID = Blueprint._id.toString();

					if( await Blueprint.save() ) {
						for( const [ Key, File ] of Object.entries( Files ) ) {
							fs.mkdirSync( path.join( __BlueprintDir, ID ), { recursive: true } );
							switch ( Key ) {
								case "SBP":
									await File.mv( path.join( __BlueprintDir, ID, `${ ID }.sbp` ) );
									break;
								case "SBPCFG":
									await File.mv( path.join( __BlueprintDir, ID, `${ ID }.sbpcfg` ) );
									break;
								case "Image":
									await File.mv( path.join( __BlueprintDir, ID, `img_${ ID }.jpg` ) );
									break;
								default:
									break;
							}
						}

						Response.Data = ID;
						Response.Success = true;
						Response.MessageCode = "Blueprint.success.Created";
					}
				}
			}
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( "api", e.message );
			}
		}

		res.json( {
			...Response
		} );*/
	} );

	Router.post( ApiUrl( EApiUserBlueprints.edit ), MW_Auth, async( req: ExpressRequest<{
		blueprint: Omit<BlueprintData, "_id" | "__v">,
		blueprintName: string,
		blueprintId: BlueprintClass<true>
	}>, res: Response ) => {
		/*const Response: TResponse_BPUser_Edit = {
			...DefaultResponseFailed
		};

		const Request: TRequest_BPUser_Edit = req.body;
		const Files = req.files as TRequest_BPUser_Edit_Files;

		try {
			if( Request.BlueprintName && Request.BlueprintDesc && Request.UserClass && Request.DesignerSize ) {
				const Blueprint = await DB_Blueprints.findById( Request.BlueprintId );
				if( Blueprint ) {
					Blueprint.description = Request.BlueprintDesc;
					Blueprint.name = Request.BlueprintName;
					Blueprint.tags = Request.BlueprintTags || [];
					Blueprint.mods = Request.BlueprintMods || [];
					Blueprint.owner = Request.UserClass.Get._id;
					Blueprint.DesignerSize = Request.DesignerSize;
					const ID = Blueprint._id.toString();

					if( await Blueprint.save() ) {
						if( Files?.Image ) {
							for( const [ Key, File ] of Object.entries( Files ) ) {
								fs.mkdirSync( path.join( __BlueprintDir, ID ), { recursive: true } );
								switch ( Key ) {
									case "Image":
										// eslint-disable-next-line no-case-declarations
										const ImgPath = path.join( __BlueprintDir, ID, `img_${ ID }.jpg` );
										fs.existsSync( ImgPath ) && fs.rmSync( ImgPath );
										await File.mv( ImgPath );
										break;
									default:
										break;
								}
							}
						}

						Response.Data = ID;
						Response.Success = true;
						Response.MessageCode = "Blueprint.success.Edited";

					}
				}
			}
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( "api", e.message );
			}
		}

		res.json( {
			...Response
		} );*/
	} );
}