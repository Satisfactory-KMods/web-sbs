import { ApiUrl }    from "../../Lib/Express.Lib";
import {
	Request,
	Response
}                    from "express";
import path          from "path";
import DB_Blueprints from "../../MongoDB/DB_Blueprints";
import fs            from "fs";
import FS            from "fs";
import * as Compress from "compressing";

export default function() {
	Api.get( ApiUrl( "download/:id" ), async( req : Request, res : Response ) => {
		try {
			const { id } = req.params;
			const blueprint = await DB_Blueprints.findById( id );
			if ( !blueprint ) {
				return res.status( 404 ).json( { error: "Blueprint not found" } );
			}
			const ZipTempDir = path.join( __MountDir, "Zips", id );

			const FileSBP = path.join( __BlueprintDir, id, `${ id }.sbp` );
			const FileSBPCFG = path.join( __BlueprintDir, id, `${ id }.sbpcfg` );

			if ( !fs.existsSync( FileSBP ) || !fs.existsSync( FileSBPCFG ) ) {
				return res.status( 404 ).json( { error: "Blueprint not found" } );
			}

			const BPName = blueprint.name.replace( /[^a-z0-9]/gi, "_" ).toLowerCase();
			const ZipFile = path.join( __MountDir, "Zips", id, `${ BPName }.zip` );

			if ( fs.existsSync( ZipFile ) ) {
				console.error( ZipFile );
				return res.download( ZipFile, `${ BPName }.zip` );
			}

			const ZipStream = new Compress.zip.Stream();

			fs.mkdirSync( ZipTempDir, { recursive: true } );

			const CopiedFileSBP = path.join( ZipTempDir, `${ BPName }.sbp` );
			const CopiedFileSBPCFG = path.join( ZipTempDir, `${ BPName }.sbpcfg` );

			fs.copyFileSync( FileSBP, CopiedFileSBP );
			fs.copyFileSync( FileSBPCFG, CopiedFileSBPCFG );

			ZipStream.addEntry( CopiedFileSBP );
			ZipStream.addEntry( CopiedFileSBPCFG );

			const destStream = FS.createWriteStream( ZipFile );
			ZipStream.pipe( destStream ).on( "finish", () => {
				fs.rmSync( CopiedFileSBP );
				fs.rmSync( CopiedFileSBPCFG );
				fs.writeFileSync( path.join( ZipTempDir, `created.log` ), Date.now().toString() );
				SystemLib.Log( "Blueprint Download Created: " + ZipFile );
				return res.download( ZipFile, `${ BPName }.zip` );
			} ).on( "error", ( err ) => {
				return res.status( 404 ).json( { error: "Blueprint not found" } );
			} );
		}
		catch ( e ) {
			return res.status( 404 ).json( { error: "Blueprint not found" } );
		}
	} );
}