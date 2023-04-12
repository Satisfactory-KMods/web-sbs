import fs   from "fs";
import path from "path";

export function InstallRoutings( Dir : string ) {
	for ( const File of fs.readdirSync( Dir ) ) {
		const DirTarget = path.join( Dir, File );
		const Stats = fs.statSync( DirTarget );
		if ( Stats.isDirectory() ) {
			InstallRoutings( DirTarget );
		}
		else {
			import( DirTarget ).then(
				( Module ) => Module.default()
			);
		}
	}
}