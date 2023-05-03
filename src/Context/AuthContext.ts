import { createContext } from "react";
import { User }          from "@shared/Class/User.Class";

export default createContext<{
	loggedIn : boolean,
	user : User
}>( {
	loggedIn: false,
	user: new User( "" )
} );