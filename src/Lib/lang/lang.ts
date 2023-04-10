import en_us from "./data/en_us.json";
import de_de from "./data/de_de.json";

export interface ILang {
	Navigation : {
		Home : string,
		AddBlueprint : string,
		MyBlueprints : string
	};
}

export const SupportedLangs: Record<string, ILang> = {
	"de_de": de_de,
	"en_us": en_us
};

export const LangReadable: Record<string, string> = {
	"de_de": "Deutsch",
	"en_gb": "British English",
	"en_us": "English"
};

export function GetLanguage( Lang : string | undefined ) : ILang {
	if ( !Lang || Lang === "" || !Object.keys( SupportedLangs ).includes( Lang ) ) {
		Lang = "en_us";
	}

	const Fallback: ILang = SupportedLangs.en_us;
	const LangData: ILang = SupportedLangs[ Lang ] ;

	return {
		...Fallback,
		...LangData
	};
}