import type { Mod } from "@server/MongoDB/MongoMods";
import type { Tag } from "@server/MongoDB/MongoTags";
import { createContext } from "react";


export default createContext( {
	mods: [] as Mod[],
	tags: [] as Tag[]
} );
