const fs = require( 'fs' );

const LangJSON = { ...require( './src/Lib/lang/data/en_us.json' ) };
const TypeFile = "./src/Types/lang.d.ts";
let LangFile = "";

if ( fs.existsSync( TypeFile ) ) {
	fs.rmSync( TypeFile );
}

function updateLang( Obj ) {
	console.log( "------------------------------" )
	for ( const [ key, value ] of Object.entries( Obj ) ) {
		if ( key === "ApiMessgaes" ) {
			LangJSON.ApiMessgaes = "Record<string, IApiMessage>"
			console.log( "Update type of", key, "to", "Record<string, IApiMessage>" )
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
LangFile = `export interface ILang ${ JSON.stringify( LangJSON, null, 4 ) }`

fs.writeFileSync( TypeFile, `import { SweetAlertIcon } from "sweetalert2";

` + LangFile.replaceAll( '"string"', "string" ).replaceAll( '"number"', "number" ).replaceAll( '"Record<string, IApiMessage>"', "Record<string, IApiMessage>" ) + `;

export interface IApiMessage {
\ttitle? : string,
\ttext? : string,
\ticon : SweetAlertIcon
};
` );