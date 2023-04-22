import {
	ApiUrl,
	MW_Auth,
	MW_Permission
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
	TRequest_BPUser_Edit,
	TRequest_BPUser_Edit_Files,
	TRequest_BPUser_ToggleLike
}                             from "../../../../src/Shared/Types/API_Request";
import {
	TResponse_BPUser_Create,
	TResponse_BPUser_Edit,
	TResponse_BPUser_ToggleLike
}                             from "../../../../src/Shared/Types/API_Response";
import DB_Blueprints          from "../../MongoDB/DB_Blueprints";
import path                   from "path";
import fs                     from "fs";
import { ERoles }             from "../../../../src/Shared/Enum/ERoles";

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
		}
		catch ( e ) {
			if ( e instanceof Error ) {
				SystemLib.LogError( e );
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

						SocketIO.to( Blueprint._id.toString() ).emit( "BlueprintUpdated", Blueprint.toJSON() );
					}
				}
			}
		}
		catch ( e ) {
			if ( e instanceof Error ) {
				SystemLib.LogError( e );
			}
		}

		res.json( {
			...Response
		} );
	} );


	Router.post( ApiUrl( EApiUserBlueprints.like ), MW_Auth, async( req : Request, res : Response ) => {
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

				SocketIO.to( Document._id.toString() ).emit( "BlueprintUpdated", Document.toJSON() );
			}
		}
		catch ( e ) {
			if ( e instanceof Error ) {
				SystemLib.LogError( e );
			}
		}

		res.json( {
			...Response
		} );
	} );

	Router.post( ApiUrl( EApiUserBlueprints.blacklist ), MW_Auth, ( req, res, next ) => MW_Permission( req, res, next, ERoles.moderator ), async( req : Request, res : Response ) => {
		let Response : TResponse_BPUser_ToggleLike = {
			...DefaultResponseFailed
		};

		const Request : TRequest_BPUser_ToggleLike = req.body;

		try {
			if ( Request.Id && Request.UserClass ) {
				const Document = ( await DB_Blueprints.findById( Request.Id ) )!;

				Document.blacklisted = !Document.blacklisted;

				await Document.save();

				Response = {
					...DefaultResponseSuccess,
					Data: Document.likes,
					MessageCode: Document.blacklisted ? "Blueprint.success.Blacklisted" : "Blueprint.success.UnBlacklisted"
				};

				SocketIO.to( Document._id.toString() ).emit( "BlueprintUpdated", Document.toJSON() );
			}
		}
		catch ( e ) {
			if ( e instanceof Error ) {
				SystemLib.LogError( e );
			}
		}

		res.json( {
			...Response
		} );
	} );

	Router.post( ApiUrl( EApiUserBlueprints.remove ), MW_Auth, async( req : Request, res : Response ) => {
		let Response : TResponse_BPUser_ToggleLike = {
			...DefaultResponseFailed
		};

		const Request : TRequest_BPUser_ToggleLike = req.body;

		try {
			const Document = ( await DB_Blueprints.findById( Request.Id ) )!;
			if ( Request.Id && Request.UserClass && ( Request.UserClass.HasPermssion( ERoles.admin ) || Document._id.toString() === Request.UserClass.Get._id.toString() ) ) {

				const Zips = path.join( __MountDir, "Zips", Document._id.toString() );
				const Files = path.join( __BlueprintDir, Document._id.toString() );

				await Document.deleteOne();

				fs.existsSync( Zips ) && fs.rmSync( Zips, { recursive: true } );
				fs.existsSync( Files ) && fs.rmSync( Files, { recursive: true } );

				Response = {
					...DefaultResponseSuccess,
					Data: Document.likes,
					MessageCode: "Blueprint.success.Removed"
				};
			}
		}
		catch ( e ) {
			if ( e instanceof Error ) {
				SystemLib.LogError( e );
			}
		}

		res.json( {
			...Response
		} );
	} );
}