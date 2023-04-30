import {
	useEffect,
	useState
}                          from "react";
import { useLocalStorage } from "@kyri123/k-reactutils";
import {
	GetLanguage,
	SupportedLangs
}                          from "@applib/lang/lang";
import { type ILocale }         from "@app/Types/lang";

export interface IuseLang {
	AllCodes : string[],
	Code : string,
	Lang : ILocale,
	setLang : ( Value : string ) => void
}

export function useLang() : IuseLang {
	const { Storage, SetStorage } = useLocalStorage( "lang", "en_us" );
	const [ Lang, setLang ] = useState<ILocale>( GetLanguage( Storage ) );

	useEffect( () => {
		setLang( GetLanguage( Storage ) );
	}, [ Storage ] );

	return {
		AllCodes: Object.keys( SupportedLangs ),
		Code: Storage,
		Lang,
		setLang: SetStorage
	};
}