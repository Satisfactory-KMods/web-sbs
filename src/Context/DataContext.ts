import { createContext } from "react";
import type {
	MO_Mod,
	MO_Tag
}                        from "@shared/Types/MongoDB";

export default createContext( {
	mods: [] as MO_Mod[],
	tags: [] as MO_Tag[]
} );