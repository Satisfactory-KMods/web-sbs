import { ApiUrl } from "@server/Lib/Express.Lib";
import MongoBlueprints, { MongoBlueprintPacks } from "@server/MongoDB/MongoBlueprints";
import * as Compress from "compressing";
import type {
	Request,
	Response
} from "express";
import { default as FS, default as fs } from "fs";
import path from "path";

export default function() {
	Router.get( ApiUrl( "download/:id/:only?" ), async( req: Request, res: Response ) => {
		try {
			const { id, only } = req.params;
			const blueprint = await MongoBlueprints.findOne( { _id: id, blacklisted: { $ne: true } } );
			if( !blueprint ) {
				return res.status( 404 ).json( { error: "Blueprint not found" } );
			}
			const ZipTempDir = path.join( __MountDir, "Zips", id );

			const FileSBP = path.join( __BlueprintDir, id, `${ id }.sbp` );
			const FileSBPCFG = path.join( __BlueprintDir, id, `${ id }.sbpcfg` );

			if( !fs.existsSync( FileSBP ) || !fs.existsSync( FileSBPCFG ) ) {
				return res.status( 404 ).json( { error: "Blueprint not found" } );
			}

			const BPName = blueprint.originalName;
			const ZipFile = path.join( __MountDir, "Zips", id, `${ BPName }.zip` );
			const AsOnly = path.join( __MountDir, "Zips", id, `${ BPName }.${ only }` );

			if( !DownloadIPCached.find( R => R.id === blueprint._id.toString() && R.ip === req.ip ) ) {
				if( !blueprint.downloads ) {
					blueprint.downloads = 0;
				}
				blueprint.downloads++;
				if( await blueprint.save() ) {
					DownloadIPCached.push( { ip: req.ip, id: blueprint._id.toString() } );
				}
			}

			if( fs.existsSync( ZipFile ) ) {
				if( only && fs.existsSync( AsOnly ) ) {
					return res.download( AsOnly );
				}

				return res.download( ZipFile, `${ BPName }.zip` );
			}

			const SBPCFGFILE = path.join( __MountDir, "Zips", id, `${ BPName }.sbpcfg` );
			const SBPFILE = path.join( __MountDir, "Zips", id, `${ BPName }.sbp` );
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
				fs.renameSync( CopiedFileSBP, SBPFILE );
				fs.renameSync( CopiedFileSBPCFG, SBPCFGFILE );

				fs.writeFileSync( path.join( ZipTempDir, `created.log` ), Date.now().toString() );
				SystemLib.Log( "api", "Blueprint Download Created: " + ZipFile );

				if( only && fs.existsSync( AsOnly ) ) {
					return res.download( AsOnly );
				}

				return res.download( ZipFile, `${ BPName }.zip` );
			} ).on( "error", ( err ) => {
				return res.status( 404 ).json( { error: "Blueprint not found" } );
			} );

		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( "api", e.message );
			}
			return res.status( 404 ).json( { error: "Blueprint not found" } );
		}
	} );

	Router.get( ApiUrl( "download/pack/:id" ), async( req: Request, res: Response ) => {
		try {
			const { id } = req.params;
			const BPPack = await MongoBlueprintPacks.findOne( { _id: id, blacklisted: { $ne: true } } );
			if( !BPPack ) {
				return res.status( 404 ).json( { error: "Blueprint not found" } );
			}
			const ZipTempDir = path.join( __MountDir, "Zips", id );
			const ZipFile = path.join( __MountDir, "Zips", id, `${ id }.zip` );

			if( !DownloadIPCached.find( R => R.id === BPPack._id.toString() && R.ip === req.ip ) ) {
				if( !BPPack.downloads ) {
					BPPack.downloads = 0;
				}
				BPPack.downloads++;
				if( await BPPack.save() ) {
					DownloadIPCached.push( { ip: req.ip, id: BPPack._id.toString() } );
				}
			}
			if( fs.existsSync( ZipFile ) ) {
				return res.download( ZipFile, `${ BPPack._id.toString() }.zip` );
			}

			const ZipStream = new Compress.zip.Stream();

			fs.mkdirSync( ZipTempDir, { recursive: true } );

			for( const BlueprintID of BPPack.blueprints ) {
				try {
					const BP = await MongoBlueprints.findOne( { _id: BlueprintID, blacklisted: { $ne: true } } );
					if( BP ) {
						const BPName = BP.name.replace( /[^a-z0-9]/gi, "_" ).toLowerCase();

						const CopiedFileSBP = path.join( ZipTempDir, `${ BPName }.sbp` );
						const CopiedFileSBPCFG = path.join( ZipTempDir, `${ BPName }.sbpcfg` );

						const FileSBP = path.join( __BlueprintDir, id, `${ id }.sbp` );
						const FileSBPCFG = path.join( __BlueprintDir, id, `${ id }.sbpcfg` );

						fs.copyFileSync( FileSBP, CopiedFileSBP );
						fs.copyFileSync( FileSBPCFG, CopiedFileSBPCFG );

						ZipStream.addEntry( CopiedFileSBP );
						ZipStream.addEntry( CopiedFileSBPCFG );
					}
				} catch( e ) {
					if( e instanceof Error ) {
						SystemLib.LogError( "api", e.message );
					}
				}
			}

			const destStream = FS.createWriteStream( ZipFile );
			ZipStream.pipe( destStream ).on( "finish", () => {
				for( const File of fs.readdirSync( ZipTempDir ) ) {
					if( File.endsWith( ".sbp" ) || File.endsWith( ".sbpcfg" ) ) {
						fs.rmSync( path.join( ZipTempDir, File ) );
					}
				}
				fs.writeFileSync( path.join( ZipTempDir, `created.log` ), Date.now().toString() );
				SystemLib.Log( "api", "BlueprintPack Download Created: " + ZipFile );
				return res.download( ZipFile, `${ BPPack._id.toString() }.zip` );
			} ).on( "error", ( err ) => {
				return res.status( 404 ).json( { error: "Blueprint not found" } );
			} );
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