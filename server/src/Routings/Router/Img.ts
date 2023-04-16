import { ApiUrl } from "../../Lib/Express.Lib";
import {
	Request,
	Response
}                 from "express";
import path       from "path";

export default function() {
	Api.get( ApiUrl( "image/:id" ), async( req : Request, res : Response ) => {
		res.sendFile( path.join( __BlueprintDir, req.params.id, `img_${ req.params.id }.jpg` ) );
	} );
}