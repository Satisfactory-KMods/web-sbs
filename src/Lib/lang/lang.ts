import en_us              from "./data/en_us.json";
import de_de              from "./data/de_de.json";
import * as _             from "lodash";
import { SweetAlertIcon } from "sweetalert2";

export interface IApiMessage {
	title? : string,
	text? : string,
	icon : SweetAlertIcon
}

export interface ILang {
	"Sorting" : {
		"CreatedAt" : string,
		"CreatedAtRev" : string,
		"Downloads" : string,
		"DownloadsRev" : string,
		"Likes" : string,
		"LikesRev" : string,
		"Mods" : string,
		"ModsRev" : string,
		"Tags" : string,
		"TagsRev" : string,
	},
	"General" : {
		"IsModded" : string,
		"IsVanilla" : string,
		"IsHot" : string,
		"Yes" : string,
		"No" : string,
		"FilterMods" : string,
		"SortingBy" : string,
		"Search" : string,
		"ClearSearch" : string,
		"SearchFilter" : string
	},
	"Auth" : {
		"SignUpIn" : string,
		"Signup" : string,
		"Signin" : string,
		"Logout" : string,
		"AccSettings" : string,
		"Password" : string,
		"PasswordAgain" : string,
		"Email" : string,
		"Username" : string,
		"Edit" : string
	},
	"Navigation" : {
		"FicsitApp" : string,
		"Discord" : string,
		"Github" : string,
		"Patreon" : string,
		"Privacy" : string,
		"Terms" : string,
		"Home" : string,
		"AddBlueprint" : string,
		"MyBlueprints" : string,
		"Admin_Users" : string,
		"Admin_Tags" : string,
		"Admin_BlacklistedBlueprints" : string
	};
	"ErrorPage" : {
		"BackToHome" : string,
		"ErrorTitle" : string,
		"Err401" : string,
		"Err404" : string,
		"Err403" : string
	},
	"ShowBlueprint" : {
		"ObjectCount" : string
	},
	"EditBlueprint" : {
		"Title" : string,
		"Submit" : string
		"Back" : string
	},
	"AdminUsers" : {
		"Role" : string,
		"Username" : string,
		"Id" : string
	},
	"AdminTags" : {
		"Id" : string,
		"DisplayName" : string,
		"Actions" : string,
		"ModalEdit" : string,
		"ModalCreate" : string,
		"Create" : string,
		"Edit" : string,
		"Close" : string
	},
	"MyBlueprint" : {
		"BP" : string,
		"CreatedAt" : string
		"Likes" : string,
		"Mods" : string,
		"Tags" : string,
		"Actions" : string,
		"Downloads" : string
	},
	"CreateBlueprint" : {
		"ImportFromFiles" : string,
		"BlueprintName" : string,
		"BlueprintDescripton" : string,
		"BlueprintSize" : string,
		"File1" : string,
		"File2" : string,
		"Image" : string
		"Logo" : string,
		"Submit" : string,
		"Information" : string,
		"DesignerSize" : string,
		"Tags" : string,
		"Mods" : string
	};
	"ApiMessgaes" : Record<string, IApiMessage>,
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

export function GetLanguage( Lang : string | undefined ) : ILang {
	if ( !Lang || Lang === "" || !Object.keys( SupportedLangs ).includes( Lang ) ) {
		Lang = "en_us";
	}

	const Fallback : ILang = _.cloneDeep( SupportedLangs.en_us );
	const LangData : ILang = _.cloneDeep( SupportedLangs[ Lang ] );

	return _.merge( Fallback, LangData );
}

export function GetApiMessage( Code? : string ) : IApiMessage | undefined {
	if ( !Code ) {
		return undefined;
	}
	const Lang = GetLanguage( window.localStorage.getItem( "lang" ) || undefined );
	return Lang.ApiMessgaes[ Code ];
}