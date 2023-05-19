import type { BlueprintPackExtended } from "@server/MongoDB/MongoBlueprints";
import { useState } from 'react';


export function useBlueprintPack( InitValue: BlueprintPackExtended ) {
	const [ blueprintPack, setBlueprintPack ] = useState( InitValue );

	return {
		blueprintPack
	};
}
