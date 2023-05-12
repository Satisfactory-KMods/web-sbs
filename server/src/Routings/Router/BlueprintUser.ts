import {
	ApiUrl,
	MW_Auth
} from "@server/Lib/Express.Lib";
import DB_Blueprints from "@server/MongoDB/DB_Blueprints";
import {
	DefaultResponseFailed
} from "@shared/Default/Auth.Default";
import { EApiUserBlueprints } from "@shared/Enum/EApiPath";
import type {
	TRequest_BPUser_Create,
	TRequest_BPUser_Create_Files,
	TRequest_BPUser_Edit,
	TRequest_BPUser_Edit_Files
} from "@shared/Types/API_Request";
import type {
	TResponse_BPUser_Create,
	TResponse_BPUser_Edit
} from "@shared/Types/API_Response";
import type {
	Request,
	Response
} from "express";
import fs from "fs";
import path from "path";

export default function() {
	Router.post( ApiUrl( EApiUserBlueprints.create ), MW_Auth, async( req : Request, res : Response ) => {
		const Response : TResponse_BPUser_Create = {
			...DefaultResponseFailed
		};

		const Request : TRequest_BPUser_Create = req.body;
		const Files = req.files as TRequest_BPUser_Create_Files;

		try {
			if ( Request.BlueprintName && Request.BlueprintDesc && Request.UserClass && Request.DesignerSize ) {
				if ( Files.SBP && Files.SBPCFG && Files.Image ) {
					const Blueprint = new DB_Blueprints();
					Blueprint.description = Request.BlueprintDesc;
					Blueprint.name = Request.BlueprintName;
					Blueprint.tags = Request.BlueprintTags || [];
					Blueprint.mods = Request.BlueprintMods || [];
					Blueprint.owner = Request.UserClass.Get._id;
					Blueprint.DesignerSize = Request.DesignerSize;
					const ID = Blueprint._id.toString();

					if ( await Blueprint.save() ) {
						for ( const [ Key, File ] of Object.entries( Files ) ) {
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
		} catch ( e ) {
			if ( e instanceof Error ) {
				SystemLib.LogError( "api", e.message );
			}
		}

		res.json( {
			...Response
		} );
	} );


	Router.post( ApiUrl( EApiUserBlueprints.edit ), MW_Auth, async( req : Request, res : Response ) => {
		const Response : TResponse_BPUser_Edit = {
			...DefaultResponseFailed
		};

		const Request : TRequest_BPUser_Edit = req.body;
		const Files = req.files as TRequest_BPUser_Edit_Files;

		try {
			if ( Request.BlueprintName && Request.BlueprintDesc && Request.UserClass && Request.DesignerSize ) {
				const Blueprint = await DB_Blueprints.findById( Request.BlueprintId );
				if ( Blueprint ) {
					Blueprint.description = Request.BlueprintDesc;
					Blueprint.name = Request.BlueprintName;
					Blueprint.tags = Request.BlueprintTags || [];
					Blueprint.mods = Request.BlueprintMods || [];
					Blueprint.owner = Request.UserClass.Get._id;
					Blueprint.DesignerSize = Request.DesignerSize;
					const ID = Blueprint._id.toString();

					if ( await Blueprint.save() ) {
						if ( Files?.Image ) {
							for ( const [ Key, File ] of Object.entries( Files ) ) {
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
		} catch ( e ) {
			if ( e instanceof Error ) {
				SystemLib.LogError( "api", e.message );
			}
		}

		res.json( {
			...Response
		} );
	} );
}