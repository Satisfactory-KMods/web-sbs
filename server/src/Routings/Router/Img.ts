import { ApiUrl } from "@server/Lib/Express.Lib";
import type {
	Request,
	Response
} from "express";
import fs from "fs";
import path from "path";

export default function() {
	Router.get( ApiUrl( "image/:id" ), async( req : Request, res : Response ) => {
		let File = path.join( __BlueprintDir, req.params.id, `img_${ req.params.id }.jpg` );
		if ( !fs.existsSync( File ) ) {
			File = path.join( __BaseDir, "../..", "public/images/default/unknown.png" );
		}
		res.sendFile( File );
	} );
}