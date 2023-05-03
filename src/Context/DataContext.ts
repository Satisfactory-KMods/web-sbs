import { createContext } from "react";
import type { Mod }           from "@server/MongoDB/DB_Mods";
import type { Tag }           from "@server/MongoDB/DB_Tags";

export default createContext( {
	mods: [] as Mod[],
	tags: [] as Tag[]
} );