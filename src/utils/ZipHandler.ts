import { env } from "@/env.mjs";
import { prisma } from "@/server/db";
import type { Blueprints } from "@prisma/client";
import * as compress from "compressing";
import { createWriteStream, existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import z from "zod/lib";
import { mountHandler } from './MoundHandler';


export interface ZipMeta {
	file: string,
	timestamp: Record<string, number>
}

const fileValidate = z.string().refine( v => v === "sbp" || v === "sbpcfg" );

class ZipHandler {
	public async getFileDownload( id: string, file: string ): Promise<[string, string] | undefined> {
		fileValidate.parse( file );
		const data = await prisma.blueprints.findUnique( { where: { id } } );
		if( data ) {
			return [ join( mountHandler.blueprintDir, data.id, data.id + "." + file ), data.originalName + "." + file ];
		}
		return undefined;
	}

	public async getOrCreatePack( id: string ): Promise<string | undefined> {
		const data = await prisma.blueprintPacks.findUnique( { where: { id } } );
		if( data ) {
			const blueprints = await prisma.blueprints.findMany( { where: { id: { in: data.blueprintids } } } );
			const zipDirPath = join( mountHandler.zipDir, data.id );
			const stamps = this.toTimeStamps( blueprints );
			const meta = this.getMeta( join( zipDirPath, "meta.json" ), stamps );
			if( meta ) {
				return meta.file;
			} else {
				return await this.createZip( blueprints, zipDirPath, data.id + '.zip', stamps )
					.catch( e => {
						console.error( e );
						return undefined;
					} );
			}
		}
		return undefined;
	}

	public async getOrCreateBlueprint( id: string ): Promise<string | undefined> {
		const data = await prisma.blueprints.findUnique( { where: { id } } );
		if( data ) {
			const zipDirPath = join( mountHandler.zipDir, data.id );
			const stamps = this.toTimeStamps( [ data ] );
			const meta = this.getMeta( join( zipDirPath, "meta.json" ), stamps );
			if( meta ) {
				return meta.file;
			} else {
				return await this.createZip( [ data ], zipDirPath, data.id + '.zip', stamps )
					.catch( e => {
						console.error( e );
						return undefined;
					} );
			}
		}
		return undefined;
	}

	private async createZip( blueprints: Blueprints[], zipDirPath: string, zipDirFile: string, timeStamps: Record<string, number> ): Promise<string | undefined> {
		if( existsSync( zipDirPath ) ) {
			rmSync( zipDirPath, { recursive: true } );
		}
		const filePath = join( zipDirPath, zipDirFile );
		const zipStream = new compress.zip.Stream();

		for( const bp of blueprints ) {
			const sbpDownloadFile = join( mountHandler.blueprintDir, bp.id, bp.id + ".sbp" );
			const sbpcfgDownloadFile = join( mountHandler.blueprintDir, bp.id, bp.id + ".sbpcfg" );
			zipStream.addEntry( sbpDownloadFile );
			zipStream.addEntry( sbpcfgDownloadFile );
		}

		mkdirSync( zipDirPath, { recursive: true } );
		const destStream = createWriteStream( filePath );
		await new Promise<void>( ( resolve, reject ) => {
			zipStream.pipe( destStream ).on( "finish", () => {
				writeFileSync( join( zipDirPath, `meta.log` ), JSON.stringify( {
					file: zipDirFile,
					timestamp: timeStamps
				} ) );
				resolve();
			} ).on( "error", err => reject( new Error( "Blueprint Pack can't create: " + err.message ) ) );
		} );

		return undefined;
	}

	private toTimeStamps( blueprints: Blueprints[] ): Record<string, number> {
		return blueprints.reduce<Record<string, number>>( ( last, bp ) => ( { ...last, [ bp.id ]: bp.updatedAt.valueOf() } ), {} );
	}

	private getMeta( metaDirPath: string, timeStamps: Record<string, number> ): ZipMeta | undefined {
		if( existsSync( metaDirPath ) ) {
			const meta = join( metaDirPath, "meta.json" );
			if( existsSync( meta ) ) {
				try {
					const data = JSON.parse( meta );
					if( typeof data === "object" && data !== null ) {
						if( typeof data.file === "string" && typeof data.timestamp === "number" ) {
							return data;
						}
					}
				} catch( e ) {
					if( e instanceof Error ) {
						console.error( e.message );
					}
				}
			}
		}
		return undefined;
	}
}

const globalForKbotApi = globalThis as unknown as{
	zipHandler: ZipHandler | undefined
};

export const zipHandler =  globalForKbotApi.zipHandler ?? new ZipHandler();

if( env.NODE_ENV !== "production" ) {
	globalForKbotApi.zipHandler = zipHandler;
}

