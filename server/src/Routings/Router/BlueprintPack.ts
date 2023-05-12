import {
	ApiUrl,
	MW_Auth,
	MW_Permission
} from "@server/Lib/Express.Lib";
import DB_BlueprintPacks from "@server/MongoDB/DB_BlueprintPacks";
import {
	DefaultResponseFailed,
	DefaultResponseSuccess
} from "@shared/Default/Auth.Default";
import { EApiBlueprintPack } from "@shared/Enum/EApiPath";
import { ERoles } from "@shared/Enum/ERoles";
import type {
	TResponse_BPP_Manage_DELETE,
	TResponse_BPP_Manage_POST
} from "@shared/Types/API_Request";
import type { TResponse_BPP } from "@shared/Types/API_Response";
import type {
	Request,
	Response
} from "express";

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
						delete Request.PackInformation.rating;
						delete Request.PackInformation.createdAt;
						delete Request.PackInformation.updatedAt;
						delete Request.PackInformation.owner;

						Document = ( await DB_BlueprintPacks.findByIdAndUpdate( Request.ID, Request.PackInformation ) )!;
						Response = {
							...DefaultResponseSuccess,
							MessageCode: "BBP.Modify.Success"
						};
					}
				} catch ( e ) {
					if ( e instanceof Error ) {
						SystemLib.LogError( "api", e.message );
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

						Request.PackInformation.owner = Request.UserClass.Get._id;
						Request.PackInformation.downloads = 0;
						Request.PackInformation.rating = [];

						Document = await DB_BlueprintPacks.create( Request.PackInformation );
						if ( Document ) {
							Response = {
								...DefaultResponseSuccess,
								Data: Document._id.toString(),
								MessageCode: "BBP.Create.Success"
							};
						}
					}
				} catch ( e ) {
					if ( e instanceof Error ) {
						SystemLib.LogError( "api", e.message );
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
						Response = {
							...DefaultResponseSuccess,
							MessageCode: "BBP.Removed.Success"
						};
					}
				} catch ( e ) {
					if ( e instanceof Error ) {
						SystemLib.LogError( "api", e.message );
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
						Response = {
							...DefaultResponseSuccess,
							MessageCode: "BBP.Modify.Success"
						};
					}
				} catch ( e ) {
					if ( e instanceof Error ) {
						SystemLib.LogError( "api", e.message );
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
				} catch ( e ) {
					if ( e instanceof Error ) {
						SystemLib.LogError( "api", e.message );
					}
				}
			}

			res.json( {
				...Response
			} );
		} );
}