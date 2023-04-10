import {
	useEffect,
	useState
}                          from "react";
import { useLocalStorage } from "@kyri123/k-reactutils";
import {
	GetLanguage,
	ILang,
	SupportedLangs
}                          from "../lang/lang";

export function useLang() {
	const { Storage, SetStorage } = useLocalStorage( "lang", "en_us" );
	const [ Lang, setLang ] = useState<ILang>( GetLanguage( Storage ) );

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