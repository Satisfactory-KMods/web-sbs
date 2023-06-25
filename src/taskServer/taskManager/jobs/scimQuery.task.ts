/* eslint-disable import/no-anonymous-default-export */
import { prisma } from "@/server/db";
import { JobTask } from "@/taskServer/taskManager/TaskManager";
import { Blueprint, createNewBlueprint } from "@/utils/Blueprint";
import { BlueprintReader } from "@/utils/BlueprintReader";
import { kbotApi } from "@/utils/KBotApi";
import { mountHandler } from "@/utils/MoundHandler";
import { DesignerSize } from "@/utils/enum/DesignerSize";
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync } from "fs";
import { writeFile } from "fs/promises";
import fetch from 'node-fetch';
import path, { join } from "path";


const time = 3600000 * 24 / 12;

export default new JobTask(
	time,
	"SCIM Query",
	async() => {
		console.info( "tasks",
			"Running Task",
			"SCIM"
		);
		let user = ( await prisma.user.findFirst( { where: { name: "Satisfactory - Calculator" } } )! );
		if( !user ) {
			user = await prisma.user.create( {
				data: {
					name: "Satisfactory - Calculator",
					email: "none@none.de"
				}
			} );
		}

		if( !user ) {
			console.info( "tasks", "Cancel SCIM Task" );
			return;
		}

		const mods = new Set<string>();
		const calledIds = new Set<string>();
		const blacklist = new Set<string>( [
			"3142", "2635"
		] );
		outLoop: for( let page = 1; page < 10000; page++ ) {
			const fetchPageUrl = `https://satisfactory-calculator.com/de/blueprints/index/index/p/${ page }`;
			const response = await fetch( fetchPageUrl, { timeout: 10000 } ).catch( console.error );
			if( response ) {
				const pageContent = await response.text();
				const asArr = pageContent.split( "\n" );
				const ids = asArr
					.filter( e => e.includes( "/de/blueprints/index/details/id" ) )
					.map( e => e.match( /\/de\/blueprints\/index\/details\/id\/(\d+)/ )![ 1 ]! );

				const results = await Promise.all( Array.from( new Set( ids ) ).map( async id => {
					//console.info( "SCIM", "QueryID:", id, "| page:", page );
					if( blacklist.has( id ) ) {
						return true;
					}
					if( calledIds.has( id ) ) {
						return false;
					}
					calledIds.add( id );
					const fetchUrlSbp = `https://satisfactory-calculator.com/de/blueprints/index/download/id/${ id }`;
					const fetchUrlSbpcfg = `https://satisfactory-calculator.com/de/blueprints/index/download-cfg/id/${ id }`;
					const fetchSiteUrl = `https://satisfactory-calculator.com/de/blueprints/index/details/id/${ id }`;

					let originalName: string | null = null;
					const tmpDir = mountHandler.tempScim;

					const getFilePathAndName = ( fileEnding: "sbp" | "sbpcfg" | "jpg" ): string => {
						!existsSync( tmpDir ) && mkdirSync( tmpDir, { recursive: true } );
						return path.join( tmpDir, `${ originalName }.${ fileEnding }` );
					};

					let response = await fetch( fetchSiteUrl, { timeout: 10000 } ).catch( console.error );
					if( response ) {
						const page = await response.text();
						const asArr = page.split( "\n" );
						const idx = page.split( "\n" ).findIndex( e => e.includes( '"breadcrumb-item"' ) );
						if( idx > -1 ) {
							originalName = asArr[ idx + 1 ]?.replace( "</li>", "" ).trim().replace( /[/\\?%*:|"<>]/g, '' ).replace( '°', '' ) || "null";
							const imageUrl = asArr.find( e => e.includes( "blueprintsInGame" ) )?.match( /\bhttps?:\/\/\S+/gi );
							if( imageUrl && imageUrl[ 0 ] ) {
								const fetchImageUrl = imageUrl[ 0 ].replaceAll( '"', "" );

								response = await fetch( fetchImageUrl, { timeout: 10000 } ).catch( () => {} );
								const file = getFilePathAndName( "jpg" );
								if( response ) {
									await writeFile( file, await response.buffer() ).catch( console.error );
								} else {
									copyFileSync( path.join( process.cwd(), "public/images/default", "default.jpg" ), file );
									console.info( "SCIM", "default image used:", originalName );
								}
							} else {
								return true;
							}
						}
					}

					if( !originalName ) {
						return true;
					}

					response = await fetch( fetchUrlSbpcfg, { timeout: 10000 } ).catch( console.error );
					if( response ) {
						await writeFile( getFilePathAndName( "sbpcfg" ), await response.buffer() );
					} else {
						return true;
					}

					response = await fetch( fetchUrlSbp, { timeout: 10000 } ).catch( console.error );
					if( response ) {
						await writeFile( getFilePathAndName( "sbp" ), await response.buffer() );
					} else {
						return true;
					}

					if( !existsSync( getFilePathAndName( "sbp" ) ) || !existsSync( getFilePathAndName( "sbpcfg" ) ) ) {
						return true;
					}

					if( readFileSync( getFilePathAndName( "sbp" ) ).toString().startsWith( "<" ) || readFileSync( getFilePathAndName( "sbpcfg" ) ).toString().startsWith( "<" ) ) {
						return true;
					}

					try {
						const filePath = getFilePathAndName( "sbp" ).split( /[\\/]/ );
						const fileName = filePath.pop()!.replace( ".sbp", "" );
						console.log( fileName, filePath.join( "/" ) );
						const BP = new BlueprintReader( join( filePath.join( "/" ) ), fileName );
						if( BP.success ) {
							const bpDb = await prisma.blueprints.findFirst( { where: { SCIMId: parseInt( id ) } } );
							let newBp: Blueprint;
							if( !bpDb ) {
								newBp = await createNewBlueprint( {
									name: originalName,
									description: `Blueprint hosted by Satisfactory - Calculator`,
									originalName,
									designerSize: DesignerSize.mk0,
									userId: user!.id,
									tagIds: [],
									images: [],
									SCIMId: parseInt( id )
								} );
							} else {
								newBp = await Blueprint.create( bpDb );
							}

							await prisma.blueprints.update( {
								where: { id: newBp.dbData.id },
								data: {
									images: [ `image_${ newBp.dbData.id }_0.jpg` ],
									name: originalName,
									description: `Blueprint hosted by Satisfactory - Calculator`,
									originalName
								}
							} );

							const blueprintDir = path.join( mountHandler.blueprintDir, newBp.dbData.id );
							existsSync( blueprintDir ) && rmSync( blueprintDir, { recursive: true } );
							mkdirSync( blueprintDir, { recursive: true } );

							renameSync( getFilePathAndName( "sbp" ), path.join( blueprintDir, `${ newBp.dbData.id }.sbp` ) );
							renameSync( getFilePathAndName( "sbpcfg" ), path.join( blueprintDir, `${ newBp.dbData.id }.sbpcfg` ) );
							renameSync( getFilePathAndName( "jpg" ),  path.join( blueprintDir, `image_${ newBp.dbData.id }_0.jpg` ) );

							console.log( getFilePathAndName( "sbp" ), path.join( blueprintDir, `${ newBp.dbData.id }.sbp` ) );
							console.log( getFilePathAndName( "sbpcfg" ), path.join( blueprintDir, `${ newBp.dbData.id }.sbpcfg` ) );
							console.log( getFilePathAndName( "jpg" ),  path.join( blueprintDir, `image_${ newBp.dbData.id }_0.jpg` ) );

							const success = await newBp.updateBlueprint().catch( () => {
								calledIds.delete( id );
								newBp.delete();
								console.info( "SCIM", `removed:`, originalName );
								return true;
							} ).then( () =>
								//console.info( "SCIM", `created/updated:`, originalName );
								 true
							 );

							for( const mod of ( ( await newBp.getData( true ) )?.mods || [] ) ) {
								mods.add( mod );
							}

							return success;
						}
					} catch( e ) {
						return true;
					}
				} ) );

				if( results.includes( false ) ) {
					break outLoop;
				}
			}
		}

		for( const old of await prisma.blueprints.findMany( { where: {
			originalName: { in: Array.from( calledIds ) },
			SCIMId: { gte: 0 }
		} } ) ) {
			const bp = await Blueprint.create( old );
			await bp.delete();
			console.info( "SCIM", `removed:`, old.originalName );
		}
		rmSync( mountHandler.tempScim, { recursive: true, force: true } );
		await prisma.mods.deleteMany( { where: { modRef: { notIn: Array.from( mods ) } } } );
		await kbotApi.getMods( Array.from( mods ) );
	}
);
