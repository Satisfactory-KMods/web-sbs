import {
	ApiUrl,
	MW_Auth,
	MW_Permission
}                            from "../../Lib/Express.Lib";
import { EApiBlueprintPack } from "../../../../src/Shared/Enum/EApiPath";
import {
	Request,
	Response
}                            from "express";
import {
	DefaultResponseFailed,
	DefaultResponseSuccess
}                            from "../../../../src/Shared/Default/Auth.Default";
import {
	TResponse_BPP_Manage_DELETE,
	TResponse_BPP_Manage_POST,
	TResponse_BPP_Manage_SUB
}                            from "../../../../src/Shared/Types/API_Request";
import { TResponse_BPP }     from "../../../../src/Shared/Types/API_Response";
import { ERoles }            from "../../../../src/Shared/Enum/ERoles";
import DB_BlueprintPacks     from "../../MongoDB/DB_BlueprintPacks";

export default function() {
	Router
		.post( ApiUrl( EApiBlueprintPack.manage ), MW_Auth, async( req : Request, res : Response ) => {
			let Response : TResponse_BPP = {
				...DefaultResponseFailed
			};

			const Request : TResponse_BPP_Manage_POST = req.body;

			if ( Request.ID && Request.UserClass && Request.PackInformation ) {
				try {
					let Document = ( await DB_BlueprintPacks.findById( Request.ID ) )!;

					if ( Document.owner === Request.UserClass.Get._id ) {
						delete Request.PackInformation._id;
						delete Request.PackInformation.downloads;
						delete Request.PackInformation.likes;
						delete Request.PackInformation.createdAt;
						delete Request.PackInformation.updatedAt;
						delete Request.PackInformation.__v;
						delete Request.PackInformation.owner;

						Document = ( await DB_BlueprintPacks.findByIdAndUpdate( Request.ID, Request.PackInformation ) )!;
						SocketIO.emit( "BlueprintPackUpdated", Document!.toJSON() );
						Response = {
							...DefaultResponseSuccess,
							MessageCode: "BBP.Modify.Success"
						};
					}
				}
				catch ( e ) {
					if ( e instanceof Error ) {
						SystemLib.LogError( e.message );
					}
				}
			}

			res.json( {
				...Response
			} );
		} )
		.put( ApiUrl( EApiBlueprintPack.manage ), MW_Auth, async( req : Request, res : Response ) => {
			let Response : TResponse_BPP = {
				...DefaultResponseFailed
			};

			const Request : TResponse_BPP_Manage_POST = req.body;

			if ( Request.ID && Request.UserClass && Request.PackInformation ) {
				try {
					let Document = ( await DB_BlueprintPacks.findById( Request.ID ) )!;

					if ( Document.owner === Request.UserClass.Get._id && ( Request.PackInformation.name?.length || 0 ) > 6 && ( Request.PackInformation.description?.length || 0 ) >= 50 ) {
						delete Request.PackInformation._id;
						delete Request.PackInformation.__v;

						Request.PackInformation.owner = Request.UserClass.Get._id;
						Request.PackInformation.downloads = 0;
						Request.PackInformation.likes = [];

						Document = await DB_BlueprintPacks.create( Request.PackInformation );
						if ( Document ) {
							Response = {
								...DefaultResponseSuccess,
								Data: Document._id.toString(),
								MessageCode: "BBP.Create.Success"
							};
						}
					}
				}
				catch ( e ) {
					if ( e instanceof Error ) {
						SystemLib.LogError( e.message );
					}
				}
			}

			res.json( {
				...Response
			} );
		} )
		.delete( ApiUrl( EApiBlueprintPack.manage ), MW_Auth, async( req : Request, res : Response ) => {
			let Response : TResponse_BPP = {
				...DefaultResponseFailed
			};

			const Request : TResponse_BPP_Manage_DELETE = req.body;

			if ( Request.ID && Request.UserClass ) {
				try {
					let Document = ( await DB_BlueprintPacks.findById( Request.ID ) )!;

					if ( Document.owner === Request.UserClass.Get._id || Request.UserClass.HasPermssion( ERoles.moderator ) ) {
						Document = ( await DB_BlueprintPacks.findByIdAndUpdate( Request.ID, { blacklisted: true } ) )!;
						SocketIO.emit( "BlueprintPackUpdated", Document!.toJSON() );
						Response = {
							...DefaultResponseSuccess,
							MessageCode: "BBP.Removed.Success"
						};
					}
				}
				catch ( e ) {
					if ( e instanceof Error ) {
						SystemLib.LogError( e.message );
					}
				}
			}

			res.json( {
				...Response
			} );
		} )
		.subscribe( ApiUrl( EApiBlueprintPack.manage ), MW_Auth, async( req : Request, res : Response ) => {
			let Response : TResponse_BPP = {
				...DefaultResponseFailed
			};

			const Request : TResponse_BPP_Manage_SUB = req.body;
			if ( Request.UserClass && Request.ID ) {
				try {
					let Document = ( await DB_BlueprintPacks.findById( Request.ID ) )!;

					if ( Document.owner !== Request.UserClass.Get._id ) {
						const UserId = Document.likes.indexOf( Request.UserClass.Get._id );
						if ( UserId >= 0 ) {
							Document.likes.splice( UserId, 1 );
						}
						else {
							Document.likes.push( Request.UserClass.Get._id );
						}
						if ( await Document.save() ) {
							Document = ( await DB_BlueprintPacks.findById( Request.ID ) )!;
							SocketIO.emit( "BlueprintPackUpdated", Document.toJSON() );
							Response = {
								...DefaultResponseSuccess
							};
						}
					}
				}
				catch ( e ) {
					if ( e instanceof Error ) {
						SystemLib.LogError( e.message );
					}
				}
			}

			res.json( {
				...Response
			} );
		} );

	Router
		.post( ApiUrl( EApiBlueprintPack.admin ), MW_Auth, ( req, res, next ) => MW_Permission( req, res, next, ERoles.admin ), async( req : Request, res : Response ) => {
			let Response : TResponse_BPP = {
				...DefaultResponseFailed
			};

			const Request : TResponse_BPP_Manage_POST = req.body;

			if ( Request.ID && Request.UserClass && Request.PackInformation ) {
				try {
					const Document = ( await DB_BlueprintPacks.findByIdAndUpdate( Request.ID, Request.PackInformation ) )!;
					if ( Document ) {
						SocketIO.emit( "BlueprintPackUpdated", Document!.toJSON() );
						Response = {
							...DefaultResponseSuccess,
							MessageCode: "BBP.Modify.Success"
						};
					}
				}
				catch ( e ) {
					if ( e instanceof Error ) {
						SystemLib.LogError( e.message );
					}
				}
			}

			res.json( {
				...Response
			} );
		} )
		.delete( ApiUrl( EApiBlueprintPack.admin ), MW_Auth, ( req, res, next ) => MW_Permission( req, res, next, ERoles.admin ), async( req : Request, res : Response ) => {
			let Response : TResponse_BPP = {
				...DefaultResponseFailed
			};

			const Request : TResponse_BPP_Manage_DELETE = req.body;

			if ( Request.ID && Request.UserClass ) {
				try {
					const Document = ( await DB_BlueprintPacks.findById( Request.ID ) )!;
					if ( Document ) {
						await DB_BlueprintPacks.findByIdAndDelete( Request.ID, { blacklisted: true } );
						Response = {
							...DefaultResponseSuccess,
							MessageCode: "BBP.Removed.Success"
						};
					}
				}
				catch ( e ) {
					if ( e instanceof Error ) {
						SystemLib.LogError( e.message );
					}
				}
			}

			res.json( {
				...Response
			} );
		} );
}