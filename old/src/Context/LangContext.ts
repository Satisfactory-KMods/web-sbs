import { createContext }  from "react";
import { IuseLang }       from "@hooks/useLang";
import { SupportedLangs } from "@applib/lang/lang";

export default createContext<IuseLang>( {
	AllCodes: [],
	Code: "",
	Lang: SupportedLangs.en_us,
	setLang() : void {
	}
} );