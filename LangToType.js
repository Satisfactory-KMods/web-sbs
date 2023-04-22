const fs = require( 'fs' );

const LangJSON = { ...require( './src/Lib/lang/data/en_us.json' ) };
const TypeFile = "./src/Types/lang.d.ts";
let LangFile = "";

if ( fs.existsSync( TypeFile ) ) {
	fs.rmSync( TypeFile );
}

function updateLang( Obj ) {
	for ( const [ key, value ] of Object.entries( Obj ) ) {
		if ( typeof Obj[ key ] === "object" ) {
			updateLang( Obj[ key ] );
		} else {
			Obj[ key ] = typeof Obj[ key ];
		}
	}
}

updateLang( LangJSON );
LangJSON.ApiMessgaes = "Record<string, IApiMessage>"
LangFile = `export interface ILang ${ JSON.stringify( LangJSON, null, 4 ) }`

fs.writeFileSync( TypeFile, `import { SweetAlertIcon } from "sweetalert2";

` + LangFile.replaceAll( '"string"', "string" ).replaceAll( '"number"', "number" ).replaceAll( '"Record<string, IApiMessage>"', "Record<string, IApiMessage>" ) + `;

export interface IApiMessage {
\ttitle? : string,
\ttext? : string,
\ticon : SweetAlertIcon
};
` );