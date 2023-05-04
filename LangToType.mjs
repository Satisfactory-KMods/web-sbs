import fs from "fs";

const LangJSON = JSON.parse( fs.readFileSync( "./src/Lib/lang/data/en_us.json" ) );
const TypeFile = "./src/Types/lang.d.ts";

if ( fs.existsSync( TypeFile ) ) {
	fs.rmSync( TypeFile );
}

function updateLang( Obj ) {
	console.log( "------------------------------" )
	for ( const [ key, value ] of Object.entries( Obj ) ) {
		if ( key === "ApiMessgaes" ) {
			console.log( "DigInto", key )
			console.log( "------------------------------" )
			for ( const [ key2 ] of Object.entries( Obj[ key ] ) ) {
				Obj[ key ][ key2 ] = "IApiMessage"
				console.log( "Update type of", key2, "to", "IApiMessage" )
			}
			console.log( "------------------------------" )
			continue;
		}

		if ( typeof Obj[ key ] === "object" ) {
			console.log( "DigInto", key )
			updateLang( Obj[ key ] );
		} else {
			console.log( "Update type of", key, "to", typeof Obj[ key ] )
			Obj[ key ] = typeof Obj[ key ];
			continue;
		}
		console.log( "------------------------------" )
	}
}

updateLang( LangJSON );
const LangFile = `export interface ILang ${ JSON.stringify( LangJSON, null, 4 ) }`

fs.writeFileSync( TypeFile, `import { SweetAlertIcon } from "sweetalert2";

export interface IApiMessage {
\ttitle? : string,
\ttext? : string,
\ticon : SweetAlertIcon
};

` + LangFile.replaceAll( '"string"', "string" ).replaceAll( '"number"', "number" ).replaceAll( '"IApiMessage"', "IApiMessage" ) + `;` );