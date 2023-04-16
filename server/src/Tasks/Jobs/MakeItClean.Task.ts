import { JobTask } from "../TaskManager";
import path        from "path";
import fs          from "fs";

export default new JobTask(
	1800000 * 2,
	"MakeItClean",
	async() => {
		SystemLib.Log(
			"[TASKS] Running Task",
			SystemLib.ToBashColor( "Red" ),
			"MakeItClean"
		);

		const ZipPath = path.join( __MountDir, "Zips" );
		for ( const Dir of fs.readdirSync( ZipPath ) ) {
			const DirPath = path.join( ZipPath, Dir );
			const State = fs.statSync( DirPath );
			if ( State.isDirectory() ) {
				const CreateFile = path.join( DirPath, "created.log" );
				if ( !fs.existsSync( CreateFile ) ) {
					SystemLib.LogWarning( "Remove Zip for BP:", DirPath );
					fs.rmSync( DirPath, { recursive: true } );
					continue;
				}
				const Time = parseInt( fs.readFileSync( CreateFile ).toString() );
				if ( Time <= Date.now() - 1800000 * 2 ) {
					SystemLib.LogWarning( "Remove Zip for BP:", DirPath );
					fs.rmSync( DirPath, { recursive: true } );
				}
			}
			else {
				SystemLib.LogWarning( "Remove Zip for BP:", DirPath );
				fs.rmSync( DirPath, { recursive: true } );
			}
		}
	}
);
