import { ERoles }   from "../Shared/Enum/ERoles";
import React, {
	FunctionComponent,
	PropsWithChildren,
	useContext,
	useMemo
}                   from "react";
import AuthContext  from "../Context/AuthContext";
import { Navigate } from "react-router-dom";

export interface IuseAuthCheckProps extends PropsWithChildren {
	Redirect? : boolean;
	To? : string;
}

const AuthRedirect : FunctionComponent<IuseAuthCheckProps> = ( { children, Redirect, To } ) : React.ReactElement => {
	if ( Redirect ) {
		return <Navigate to={ To || "/error/401" }/>;
	}

	return <>{ children }</>;
};
export default AuthRedirect;


export function useAuthCheck( Config : Partial<{
	Role : ERoles,
	Auth : boolean,
	RedirectTo : string
}> ) : {
	AuthCheck : React.FunctionComponent<IuseAuthCheckProps & React.PropsWithChildren>
	AuthCheckProps : IuseAuthCheckProps
} {
	const { UserData, IsLoggedIn, Token } = useContext( AuthContext );

	const Check = () => {
		if ( Config.Auth !== undefined && !Config.Auth ) {
			if ( IsLoggedIn ) {
				return false;
			}
		}

		if ( Config.Auth || Config.Role ) {
			if ( !IsLoggedIn ) {
				return false;
			}
		}

		return !( Config.Role && !UserData.HasPermssion( Config.Role ) );
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const Redirect = !useMemo( Check, [ UserData, IsLoggedIn, Token, Config.Role, Config.Auth ] );

	return {
		AuthCheck: AuthRedirect,
		AuthCheckProps: {
			Redirect,
			To: Config.RedirectTo
		}
	};
}