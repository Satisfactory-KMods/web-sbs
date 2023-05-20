import DataContext from "@app/Context/DataContext";
import { successSwal, tRPCAuth, tRPCHandleError } from "@app/Lib/tRPC";
import type { Blueprint } from "@etothepii/satisfactory-file-parser";
import { useAuth } from "@hooks/useAuth";
import type { Mod } from "@kyri123/lib";
import type { BlueprintDataExtended } from "@server/MongoDB/MongoBlueprints";
import { ERoles } from "@shared/Enum/ERoles";
import _ from "lodash";
import {
	useContext,
	useMemo,
	useState
} from "react";


export interface IBlueprintHookConfig {
	blueprint: Blueprint
}

export function useBlueprintExtended( InitValue: BlueprintDataExtended ) {
	const { mods } = useContext( DataContext );
	const [ blueprint, setBlueprint ] = useState<BlueprintDataExtended>( () => InitValue );
	const { user, loggedIn } = useAuth();

	const allowedToLike = useMemo<boolean>( () => loggedIn && !_.isEqual( user.Get._id, blueprint.owner._id ), [ blueprint.owner, loggedIn, user.Get._id ] );

	const allowedToEdit = useMemo<boolean>( () => loggedIn && ( _.isEqual( user.Get._id, blueprint.owner._id ) || user.HasPermission( ERoles.admin ) ), [ blueprint.owner, loggedIn, user ] );

	const update = async() => {
		/*await tRPCPublic.blueprintPacks.getBlueprintPack.query( { blueprintPackId: blueprint._id } )
			.then( setBlueprint )
			.catch( console.error );*/
	};

	const remove = async() => {
		const result = await tRPCAuth.blueprintPacks.remove.mutate( { blueprintPackId: blueprint._id } )
			.then( successSwal )
			.catch( tRPCHandleError );
		return !!result;
	};

	const resolvedMods = useMemo<Mod[]>( () => blueprint.mods.map( e => mods.find( m => m._id === e )! ).filter( e => !!e ) || [], [ blueprint.mods, mods ] );

	return {
		blueprint,
		allowedToLike,
		allowedToEdit,
		update,
		remove,
		owner: blueprint.owner,
		tags: blueprint.tags,
		packs: blueprint.inPacks,
		mods: resolvedMods
	};
}
