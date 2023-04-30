import {
	useEffect,
	useMemo
}                         from "react";
import { useJWT }         from "@kyri123/k-reactutils";
import { User }           from "@shared/Class/User.Class";
import { API_QueryLib }   from "@applib/Api/API_Query.Lib";
import { EApiAuth }       from "@shared/Enum/EApiPath";
import { MO_UserAccount } from "@shared/Types/MongoDB";

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
	} = useJWT<MO_UserAccount>( "session" );

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const UserData = useMemo( () => new User( Token ), [ Token, Session ] );
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const IsLoggedIn = useMemo( () => UserData?.IsValid, [ UserData ] );

	const Logout = () => {
		ClearSession();
		Promise.all( [
			API_QueryLib.FireSwal( "Auth.success.Logout" ),
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