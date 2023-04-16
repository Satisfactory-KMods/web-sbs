import { ApiUrl } from "../../Lib/Express.Lib";
import {
	Request,
	Response
}                 from "express";
import path       from "path";

export default function() {
	Api.get( ApiUrl( "image/:id/:img" ), async( req : Request, res : Response ) => {
		res.sendFile( path.join( __BlueprintDir, req.params.id, `${ req.params.img }_${ req.params.id }.jpg` ) );
	} );
}