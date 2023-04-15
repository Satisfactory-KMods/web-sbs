import {
	ApiUrl,
	MW_Auth
}                             from "../../Lib/Express.Lib";
import { EApiUserBlueprints } from "../../../../src/Shared/Enum/EApiPath";
import {
	Request,
	Response
}                             from "express";
import {
	DefaultResponseFailed,
	DefaultResponseSuccess
}                             from "../../../../src/Shared/Default/Auth.Default";
import {
	TRequest_BPUser_Create,
	TRequest_BPUser_Create_Files,
	TRequest_BPUser_ToggleLike
}                             from "../../../../src/Shared/Types/API_Request";
import {
	TResponse_BPUser_Create,
	TResponse_BPUser_ToggleLike
}                             from "../../../../src/Shared/Types/API_Response";
import DB_Blueprints          from "../../MongoDB/DB_Blueprints";
import path                   from "path";
import fs                     from "fs";

export default function() {
	Api.post( ApiUrl( EApiUserBlueprints.create ), MW_Auth, async( req : Request, res : Response ) => {
		const Response : TResponse_BPUser_Create = {
			...DefaultResponseFailed
		};

		const Request : TRequest_BPUser_Create = req.body;
		const Files = req.files as TRequest_BPUser_Create_Files;

		try {
			if ( Request.BlueprintName && Request.BlueprintDesc && Request.BlueprintMods && Request.UserClass && Request.DesignerSize ) {
				if ( Files.SBP && Files.SBPCFG && Files.Image && Files.Logo ) {
					const Blueprint = new DB_Blueprints();
					Blueprint.description = Request.BlueprintDesc;
					Blueprint.name = Request.BlueprintName;
					Blueprint.tags = Request.BlueprintTags || [];
					Blueprint.mods = Request.BlueprintMods;
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
								case "Logo":
									await File.mv( path.join( __BlueprintDir, ID, `logo_${ ID }.jpg` ) );
									break;
								default:
									break;
							}
						}

						Response.Data = ID;
						Response.Success = true;
						Response.MessageCode = "BlueprintCreated";
					}
				}
			}
		}
		catch ( e ) {
			console.error( e );
		}

		res.json( {
			...Response
		} );
	} );


	Api.post( ApiUrl( EApiUserBlueprints.like ), MW_Auth, async( req : Request, res : Response ) => {
		let Response : TResponse_BPUser_ToggleLike = {
			...DefaultResponseFailed
		};

		const Request : TRequest_BPUser_ToggleLike = req.body;

		try {
			if ( Request.Id && Request.UserClass ) {
				const UserId = Request.UserClass.Get._id;
				const Document = ( await DB_Blueprints.findById( Request.Id ) )!;
				const Idx = Document.likes.indexOf( UserId );

				if ( Idx >= 0 ) {
					Document.likes.splice( Idx, 1 );
				}
				else {
					Document.likes.push( UserId );
				}

				await Document.save();

				Response = {
					...DefaultResponseSuccess,
					Data: Document.likes
				};
			}
		}
		catch ( e ) {
			console.error( e );
		}

		res.json( {
			...Response
		} );
	} );
}