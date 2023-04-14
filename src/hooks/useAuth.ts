import { useMemo } from "react";
import { useJWT }  from "@kyri123/k-reactutils";
import { User }    from "../Shared/Class/User.Class";

export interface IUseAuth {
	UserData : User,
	Logout : () => void,
	IsLoggedIn : boolean
}

export function useAuth() : IUseAuth {
	const { ClearSession, SessionActive, Token, Session } = useJWT( "session" );

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const UserData = useMemo( () => new User( Token ), [ Token, Session ] );
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const IsLoggedIn = useMemo( SessionActive, [ Token, Session ] );

	return {
		IsLoggedIn,
		Logout: ClearSession,
		UserData
	};
}