import {
	ApiUrl,
	MW_Auth
}                                  from "../../Lib/Express.Lib";
import { EApiUserBlueprints }      from "../../../../src/Shared/Enum/EApiPath";
import {
	Request,
	Response
}                                  from "express";
import { DefaultResponseFailed }   from "../../../../src/Shared/Default/Auth.Default";
import {
	TRequest_BPUser_Create,
	TRequest_BPUser_Create_Files
}                                  from "../../../../src/Shared/Types/API_Request";
import { TResponse_BPUser_Create } from "../../../../src/Shared/Types/API_Response";
import DB_Blueprints               from "../../MongoDB/DB_Blueprints";
import path                        from "path";
import fs                          from "fs";

export default function() {
	Api.post( ApiUrl( EApiUserBlueprints.create ), MW_Auth, async( req : Request, res : Response ) => {
		const Response : TResponse_BPUser_Create = {
			...DefaultResponseFailed
		};

		const Request : TRequest_BPUser_Create = req.body;
		const Files = req.files as TRequest_BPUser_Create_Files;

		try {
			if ( Request.BlueprintName && Request.BlueprintDesc && Request.BlueprintMods && Request.BlueprintTags && Request.UserClass ) {
				if ( Files.SBP && Files.SBPCFG && Files.Image && Files.Logo ) {
					const Blueprint = new DB_Blueprints();
					Blueprint.description = Request.BlueprintDesc;
					Blueprint.name = Request.BlueprintName;
					Blueprint.tags = [];
					Blueprint.mods = [];
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

						Response.Success = true;
						Response.MessageCode = "BlueprintCreated";
					}
				}
			}
		}
		catch ( e ) {
		}

		res.json( {
			...Response
		} );
	} );
}