import { ERoles }  from "../Shared/Enum/ERoles";
import {
	useContext,
	useEffect
}                  from "react";
import AuthContext from "../Context/AuthContext";

export function useAuthCheck( Config : Partial<{
	Role : ERoles,
	Auth : boolean
}> ) : boolean {
	const { UserData, IsLoggedIn, Token } = useContext( AuthContext );

	const Check = () => {
		if ( Config.Auth !== undefined && !Config.Auth ) {
			if ( IsLoggedIn ) {
				window.location.href = "/";
				return false;
			}
		}

		if ( Config.Auth || Config.Role ) {
			if ( !IsLoggedIn ) {
				window.location.href = "/login";
				return false;
			}
		}

		if ( Config.Role && !UserData.HasPermssion( Config.Role ) ) {
			window.location.href = "/";
			return false;
		}

		return true;
	};

	useEffect( () => {
		Check();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ UserData, IsLoggedIn, Token ] );

	return Check();
}