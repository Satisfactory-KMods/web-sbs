import en_us                   from "@applib/lang/data/en_us.json";
import de_de                   from "@applib/lang/data/de_de.json";
import * as _                  from "lodash";
import { type SweetAlertIcon } from "sweetalert2";
import { type ILocale }        from "@app/Types/lang";

export interface IApiMessage {
	title? : string,
	text? : string,
	icon : SweetAlertIcon
}

export const SupportedLangs : Record<string, any> = {
	"de_de": de_de,
	"en_us": en_us
};

export const LangReadable : Record<string, string> = {
	"de_de": "Deutsch",
	"en_gb": "British English",
	"en_us": "English"
};

export function GetLanguage( Lang : string | undefined ) : ILocale {
	if ( !Lang || Lang === "" || !Object.keys( SupportedLangs ).includes( Lang ) ) {
		Lang = "en_us";
	}

	const Fallback : ILocale = _.cloneDeep( SupportedLangs.en_us );
	const LangData : ILocale = _.cloneDeep( SupportedLangs[ Lang ] );

	return _.merge( Fallback, LangData );
}

export function GetApiMessage( Code? : keyof ILocale["ApiMessages"] ) : IApiMessage | undefined {
	if ( !Code ) {
		return undefined;
	}
	const Lang = GetLanguage( window.localStorage.getItem( "lang" ) || undefined );
	return Lang.ApiMessages[ Code ];
}