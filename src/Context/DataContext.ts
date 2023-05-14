import type { Mod } from "@server/MongoDB/DB_Mods";
import type { Tag } from "@server/MongoDB/DB_Tags";
import { createContext } from "react";

export default createContext( {
	mods: [] as Mod[],
	tags: [] as Tag[]
} );