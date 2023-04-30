import { createContext } from "react";
import type { IUseAuth }      from "@hooks/useAuth";
import { User }          from "@shared/Class/User.Class";

export default createContext<IUseAuth>( {
	Token: "",
	UpdateToken( Value : string ) : void {
	},
	IsLoggedIn: false, Logout() : void {
	}, UserData: new User( "" )
} );