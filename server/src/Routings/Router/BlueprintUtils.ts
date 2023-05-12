import { BlueprintParser } from "@server/Lib/BlueprintParser";
import {
	ApiUrl,
	MW_Auth
} from "@server/Lib/Express.Lib";
import DB_Blueprints from "@server/MongoDB/DB_Blueprints";
import {
	DefaultResponseFailed,
	DefaultResponseSuccess
} from "@shared/Default/Auth.Default";
import { EApiBlueprintUtils } from "@shared/Enum/EApiPath";
import type {
	TRequest_BPU_ParseBlueprint,
	TRequest_BPU_ReadBlueprint
} from "@shared/Types/API_Request";
import type { TResponse_BPU_ParseBlueprint } from "@shared/Types/API_Response";
import type {
	Request,
	Response
} from "express";
import type { UploadedFile } from "express-fileupload";
import fs from "fs";
import path from "path";

export default function() {
	Router.post( ApiUrl( EApiBlueprintUtils.parseblueprint ), MW_Auth, async( req: Request, res: Response ) => {
		let Response: TResponse_BPU_ParseBlueprint = {
			...DefaultResponseFailed
		};

		const Request: TRequest_BPU_ParseBlueprint = req.body;
		const Files: UploadedFile[] | undefined = req.files?.files as UploadedFile[] | undefined;

		if( Array.isArray( Files ) ) {
			if( Files.length >= 2 ) {
				if( Request.BlueprintName ) {
					let SBP: Buffer = Buffer.from( "" );
					let SBPCFG: Buffer = Buffer.from( "" );

					for( const File of Files ) {
						if( File.name.endsWith( ".sbp" ) ) {
							SBP = fs.readFileSync( File.tempFilePath );
						} else if( File.name.endsWith( ".sbpcfg" ) ) {
							SBPCFG = fs.readFileSync( File.tempFilePath );
						}
					}

					const Blueprint = new BlueprintParser( Request.BlueprintName, SBP, SBPCFG );
					if( Blueprint.Success ) {
						Response = {
							...DefaultResponseSuccess,
							Data: Blueprint.Get
						};
					}
				}
			}
		}

		res.json( {
			...Response
		} );
	} );
}