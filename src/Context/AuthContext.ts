import { createContext } from "react";
import { IUseAuth }      from "../hooks/useAuth";
import { User }          from "../Shared/Class/User.Class";

export default createContext<IUseAuth>( {
	UpdateToken( Value : string ) : void {
	},
	IsLoggedIn: false, Logout() : void {
	}, UserData: new User( "" )
} );