import { ApiUrl } from "@server/Lib/Express.Lib";
import type { BlueprintData, BlueprintPack } from "@server/MongoDB/MongoBlueprints";
import MongoBlueprints, { MongoBlueprintPacks } from "@server/MongoDB/MongoBlueprints";
import * as Compress from "compressing";
import type {
	Request,
	Response
} from "express";
import { default as FS, default as fs } from "fs";
import type { HydratedDocument } from "mongoose";
import path from "path";


const increaseDownloadCount = async( docu: HydratedDocument<BlueprintData>, ip: string ) => {
	const id = docu._id.toString();
	if( !DownloadIPCached.get( id )?.includes( ip ) ) {
		if( typeof docu.downloads !== "number" ) {
			docu.downloads = 0;
		}
		docu.downloads++;
		docu.markModified( "downloads" );
		await docu.save();
	}
};

const createZipForBlueprint = async( id: string, only?: string ): Promise<[ string, HydratedDocument<BlueprintData> ]> => {
	const blueprint = await MongoBlueprints.findOne( { _id: id } );
	if( blueprint ) {
		const zipDir = path.join( __MountDir, "Zips", id );
		const zipFile = path.join( zipDir, `${ blueprint.originalName }.zip` );

		const sbpFile = path.join( __BlueprintDir, id, `${ id }.sbp` );
		const sbpcfgFile = path.join( __BlueprintDir, id, `${ id }.sbpcfg` );

		const sbpDownloadFile = path.join( zipDir, `${ blueprint.originalName }.sbp` );
		const sbpcfgDownloadFile = path.join( zipDir, `${ blueprint.originalName }.sbpcfg` );
		const downloadFile = path.join( zipDir, `${ blueprint.originalName }.${ only || "zip" }` );

		if( !fs.existsSync( sbpFile ) || !fs.existsSync( sbpcfgFile ) ) {
			throw new Error( "Blueprint not found" );
		}

		if( fs.existsSync( downloadFile ) ) {
			return [ downloadFile, blueprint ];
		}

		fs.existsSync( zipDir ) && fs.rmSync( zipDir, { recursive: true } );
		fs.mkdirSync( zipDir, { recursive: true } );

		const zipStream = new Compress.zip.Stream();

		fs.copyFileSync( sbpFile, sbpDownloadFile );
		fs.copyFileSync( sbpcfgFile, sbpcfgDownloadFile );

		zipStream.addEntry( sbpDownloadFile );
		zipStream.addEntry( sbpcfgDownloadFile );

		const destStream = FS.createWriteStream( zipFile );
		await new Promise<void>( ( resolve, reject ) => {
			zipStream.pipe( destStream ).on( "finish", () => {
				fs.writeFileSync( path.join( zipDir, `created.log` ), Date.now().toString() );
				SystemLib.Log( "api", "Blueprint Download Created: " + zipFile );

				resolve();
			} ).on( "error", err => reject( "Blueprint can't create" ) );
		} );

		return [ downloadFile, blueprint ];
	}
	throw new Error( "File not found" );
};

const createZipForBlueprintPack = async( id: string, ip: string ): Promise<[ string, HydratedDocument<BlueprintPack> ]> => {
	const zipDir = path.join( __MountDir, "PackZips", id );
	const zipFile = path.join( zipDir, `${ id }.zip` );
	const docu = await MongoBlueprintPacks.findById( id );
	if( docu ) {
		if( fs.existsSync( zipFile ) ) {
			return [ zipFile, docu ];
		}

		const zipPackStream = new Compress.zip.Stream();
		const files = new Set<string>();
		for( const blueprint of docu.blueprints ) {
			const [ sbpFile, sbpcfgFile ] = await Promise.all( [
				createZipForBlueprint( blueprint.toString(), "sbp" ).catch( () => null ),
				createZipForBlueprint( blueprint.toString(), "sbpcfg" ).catch( () => null )
			] );
			if( sbpFile && sbpcfgFile && sbpFile[ 0 ] && sbpcfgFile[ 0 ] ) {
				files.add( sbpFile[ 0 ] );
				files.add( sbpcfgFile[ 0 ] );
				await increaseDownloadCount( sbpFile[ 1 ], ip );
			}
		}

		for( const file of Array.from( files ) ) {
			zipPackStream.addEntry( file );
		}

		fs.mkdirSync( zipDir, { recursive: true } );
		const destStream = FS.createWriteStream( zipFile );
		await new Promise<void>( ( resolve, reject ) => {
			zipPackStream.pipe( destStream ).on( "finish", () => {
				fs.writeFileSync( path.join( zipDir, `created.log` ), Date.now().toString() );
				SystemLib.Log( "api", "BlueprintPack Download Created: " + zipFile );

				resolve();
			} ).on( "error", err => reject( new Error( "Blueprint Pack can't create: " + err.message ) ) );
		} );

		return [ zipFile, docu ];
	}
	throw new Error( "File not found" );
};


export default function() {
	Router.get( ApiUrl( "download/pack/:id" ), async( req: Request, res: Response ) => {
		try {
			const { id } = req.params;
			const [ downloadFile ] = await createZipForBlueprintPack( id, req.ip );
			if( downloadFile ) {
				return res.download( downloadFile );
			}
			return res.status( 404 ).json( { error: "BlueprintPack not found" } );
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( "api", e.message );
			}
			return res.status( 404 ).json( { error: "BlueprintPack not found" } );
		}
	} );

	Router.get( ApiUrl( "download/:id/:only?" ), async( req: Request, res: Response ) => {
		try {
			const { id, only } = req.params;
			const [ downloadFile, blueprint ] = await createZipForBlueprint( id, only );
			if( downloadFile ) {
				await increaseDownloadCount( blueprint, req.ip );
				return res.download( downloadFile );
			}
			return res.status( 404 ).json( { error: "Blueprint not found" } );
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( "api", e.message );
			}
			return res.status( 404 ).json( { error: "Blueprint not found" } );
		}
	} );

	Router.get( ApiUrl( "image/:id/:image" ), async( req: Request, res: Response ) => {
		const { id, image } = req.params;
		let File = path.join( __BlueprintDir, id, image );
		if( !fs.existsSync( File ) ) {
			File = path.join( __BaseDir, "../..", "public/images/default/unknown.png" );
		}
		res.sendFile( File );
	} );
}
