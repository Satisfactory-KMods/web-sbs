import {
	ApiUrl,
	MW_Auth
}                                       from "../../Lib/Express.Lib";
import { EApiBlueprintUtils }           from "../../../../src/Shared/Enum/EApiPath";
import {
	Request,
	Response
}                                       from "express";
import {
	DefaultResponseFailed,
	DefaultResponseSuccess
}                                       from "../../../../src/Shared/Default/Auth.Default";
import { TRequest_BPU_ParseBlueprint }  from "../../../../src/Shared/Types/API_Request";
import { TResponse_BPU_ParseBlueprint } from "../../../../src/Shared/Types/API_Response";
import { UploadedFile }                 from "express-fileupload";
import fs                               from "fs";
import { BlueprintParser }              from "../../Lib/BlueprintParser";

export default function() {
	Api.post( ApiUrl( EApiBlueprintUtils.parseblueprint ), MW_Auth, async( req : Request, res : Response ) => {
		let Response : TResponse_BPU_ParseBlueprint = {
			...DefaultResponseFailed
		};

		const Request : TRequest_BPU_ParseBlueprint = req.body;
		const Files : UploadedFile[] | undefined = req.files?.files as UploadedFile[] | undefined;

		if ( Array.isArray( Files ) ) {
			if ( Files.length >= 2 ) {
				if ( Request.BlueprintName ) {
					let SBP : Buffer = Buffer.from( "" );
					let SBPCFG : Buffer = Buffer.from( "" );

					for ( const File of Files ) {
						if ( File.name.endsWith( ".sbp" ) ) {
							SBP = fs.readFileSync( File.tempFilePath );
						}
						else if ( File.name.endsWith( ".sbpcfg" ) ) {
							SBPCFG = fs.readFileSync( File.tempFilePath );
						}
					}

					const Blueprint = new BlueprintParser( Request.BlueprintName, SBP, SBPCFG );
					if ( Blueprint.Success ) {
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