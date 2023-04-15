import {
	useEffect,
	useMemo
}                          from "react";
import { useJWT }          from "@kyri123/k-reactutils";
import { User }            from "../Shared/Class/User.Class";
import { API_QueryLib }    from "../Lib/Api/API_Query.Lib";
import { EApiAuth }        from "../Shared/Enum/EApiPath";
import { IMO_UserAccount } from "../Shared/Types/MongoDB";

export interface IUseAuth {
	UpdateToken : ( Value : string ) => void;
	UserData : User,
	Logout : () => void,
	IsLoggedIn : boolean,
	Token : string
}

export function useAuth() : IUseAuth {
	const {
		ClearSession,
		Token,
		Session,
		UpdateToken
	} = useJWT<IMO_UserAccount>( "session" );

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const UserData = useMemo( () => new User( Token ), [ Token, Session ] );
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const IsLoggedIn = useMemo( () => UserData?.IsValid, [ UserData ] );

	const Logout = () => {
		ClearSession();
		Promise.all( [
			API_QueryLib.FireSwal( "Logout" ),
			API_QueryLib.PostToAPI( EApiAuth.logout, { Token } )
		] ).then();
	};

	useEffect( () => {
		if ( Token.trim() === "" ) {
			return;
		}

		const Response = async() => {
			return await API_QueryLib.PostToAPI( EApiAuth.validate, { Token } );
		};

		Response().then( Result => {
			if ( !Result.Auth && Result.Reached ) {
				ClearSession();
			}
		} );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ Token ] );

	return {
		UpdateToken,
		IsLoggedIn,
		Logout: Logout,
		UserData,
		Token
	};
}