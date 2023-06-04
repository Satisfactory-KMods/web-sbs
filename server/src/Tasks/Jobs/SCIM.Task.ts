import { BlueprintClass } from "@/server/src/Lib/Blueprint.Class";
import { BlueprintParser } from "@/server/src/Lib/BlueprintParser";
import MongoBlueprints from "@/server/src/MongoDB/MongoBlueprints";
import MongoUserAccount from "@/server/src/MongoDB/MongoUserAccount";
import { EDesignerSize } from "@/src/Shared/Enum/EDesignerSize";
import { JobTask } from "@server/Tasks/TaskManager";
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync } from "fs";
import { writeFile } from "fs/promises";
import fetch from 'node-fetch';
import path from "path";


const time = 3600000 * 24 / 2;

export default new JobTask(
	time,
	"SCIM",
	async() => {
		SystemLib.Log( "tasks",
			"Running Task",
			SystemLib.ToBashColor( "Red" ),
			"SCIM"
		);
		const user = await MongoUserAccount.findOne( { username: "Satisfactory - Calculator" } );

		if( !SystemLib.IsDevMode || !user ) {
			SystemLib.DebugLog( "tasks", "Cancel SCIM Task" );
			return;
		}

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
					.map( e => e.match( /\/de\/blueprints\/index\/details\/id\/(\d+)/ )![ 1 ] );

				for( const id of Array.from( new Set( ids ) ) ) {
					SystemLib.DebugLog( "SCIM", "QueryID:", id, "| page:", page );
					if( blacklist.has( id ) ) {
						continue;
					}
					if( calledIds.has( id ) ) {
						break outLoop;
					}
					calledIds.add( id );
					const fetchUrlSbp = `https://satisfactory-calculator.com/de/blueprints/index/download/id/${ id }`;
					const fetchUrlSbpcfg = `https://satisfactory-calculator.com/de/blueprints/index/download-cfg/id/${ id }`;
					const fetchSiteUrl = `https://satisfactory-calculator.com/de/blueprints/index/details/id/${ id }`;

					let originalName: string | null = null;
					const tmpDir = path.join( __MountDir, "tmp", "SCIM" );
					rmSync( tmpDir, { recursive: true, force: true } );

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
							originalName = asArr[ idx + 1 ].replace( "</li>", "" ).trim().replace( /[/\\?%*:|"<>]/g, '' ).replace( '°', '' );
							const imageUrl = asArr.find( e => e.includes( "blueprintsInGame" ) )?.match( /\bhttps?:\/\/\S+/gi );
							if( imageUrl && imageUrl[ 0 ] ) {
								const fetchImageUrl = imageUrl[ 0 ].replaceAll( '"', "" );

								response = await fetch( fetchImageUrl, { timeout: 10000 } ).catch( () => {} );
								const file = getFilePathAndName( "jpg" );
								if( response ) {
									await writeFile( file, await response.buffer() ).catch( console.error );
								} else {
									copyFileSync( path.join( process.cwd(), "public/images/default", "default.jpg" ), file );
									SystemLib.LogWarning( "SCIM", "default image used:", originalName );
								}
							} else {
								continue;
							}
						}
					}


					if( !originalName ) {
						continue;
					}

					response = await fetch( fetchUrlSbpcfg, { timeout: 10000 } ).catch( console.error );
					if( response ) {
						await writeFile( getFilePathAndName( "sbpcfg" ), await response.buffer() );
					} else {
						continue;
					}

					response = await fetch( fetchUrlSbp, { timeout: 10000 } ).catch( console.error );
					if( response ) {
						await writeFile( getFilePathAndName( "sbp" ), await response.buffer() );
					} else {
						continue;
					}

					if( readFileSync( getFilePathAndName( "sbp" ) ).toString().startsWith( "<" ) || readFileSync( getFilePathAndName( "sbpcfg" ) ).toString().startsWith( "<" ) ) {
						continue;
					}

					try {
						const BP = new BlueprintParser( originalName, readFileSync( getFilePathAndName( "sbp" ) ), readFileSync( getFilePathAndName( "sbpcfg" ) ) );
						if( BP?.Success ) {
							if( !await MongoBlueprints.exists( { originalName, SCIMId: 0 } ) ) {
								let blueprint = await MongoBlueprints.findOne( { originalName, SCIMId: { $gte: 0 } } );
								if( !blueprint ) {
									blueprint = new MongoBlueprints();
									blueprint.originalName = originalName;
									blueprint.DesignerSize = EDesignerSize.mk0;
									blueprint.totalRating = 0;
									blueprint.downloads = 0;
									blueprint.totalRatingCount = 0;
									blueprint.rating = [];
									blueprint.tags = [];
									blueprint.mods = [];
									blueprint.images = [ `image_${ blueprint._id.toString() }_0.jpg` ];
									blueprint.owner = user._id.toString();
								}

								blueprint.name = originalName;
								blueprint.description = `Blueprint hosted by Satisfactory - Calculator`;
								blueprint.SCIMId = parseInt( id );

								const bpId = blueprint._id.toString();
								const blueprintDir = path.join( __BlueprintDir, bpId );
								existsSync( blueprintDir ) && rmSync( blueprintDir, { recursive: true } );
								mkdirSync( blueprintDir, { recursive: true } );
								renameSync( getFilePathAndName( "sbp" ), path.join( blueprintDir, `${ bpId }.sbp` ) );
								renameSync( getFilePathAndName( "sbpcfg" ), path.join( blueprintDir, `${ bpId }.sbpcfg` ) );
								renameSync( getFilePathAndName( "jpg" ),  path.join( blueprintDir, `image_${ bpId }_0.jpg` ) );

								if( await blueprint.save() ) {
									await blueprint.updateModRefs();
									await blueprint.updateBlueprintData();
									SystemLib.DebugLog( "SCIM", `created/updated:`, originalName );
								}
							}
						}

						for await ( const old of MongoBlueprints.find( { originalName: { $nin: Array.from( calledIds ), SCIMId: { $gte: 0 } } } ) ) {
							const BpClass = await BlueprintClass.createClass( old._id.toString() );
							if( BpClass ) {
								SystemLib.Log( "SCIM", `removed:`, old.originalName );
								await BpClass.remove();
							}
						}
					} catch( e ) {
						continue;
					}
				}
			}
		}

		//rmSync( tmpDir, { recursive: true, force: true } );
	}
);
