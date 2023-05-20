import { successSwal, tRPCAuth, tRPCHandleError, tRPCPublic } from "@app/Lib/tRPC";
import { ERoles } from "@app/Shared/Enum/ERoles";
import { useAuth } from "@app/hooks/useAuth";
import DataContext from '@context/DataContext';
import type { Mod } from "@kyri123/lib";
import type { BlueprintPackExtended } from "@server/MongoDB/MongoBlueprints";
import _ from 'lodash';
import { useContext, useMemo, useState } from 'react';


export function useBlueprintPack( InitValue: BlueprintPackExtended ) {
	const { mods } = useContext( DataContext );
	const [ blueprintPack, setBlueprintPack ] = useState( InitValue );
	const { user, loggedIn } = useAuth();

	const allowedToLike = useMemo<boolean>( () => loggedIn && !_.isEqual( user.Get._id, blueprintPack.owner._id ), [ blueprintPack.owner, loggedIn, user.Get._id ] );

	const allowedToEdit = useMemo<boolean>( () => loggedIn && ( _.isEqual( user.Get._id, blueprintPack.owner._id ) || user.HasPermission( ERoles.admin ) ), [ blueprintPack.owner, loggedIn, user ] );

	const update = async() => {
		await tRPCPublic.blueprintPacks.getBlueprintPack.query( { blueprintPackId: blueprintPack._id } )
			.then( setBlueprintPack )
			.catch( console.error );
	};

	const remove = async() => {
		const result = await tRPCAuth.blueprintPacks.remove.mutate( { blueprintPackId: blueprintPack._id } )
			.then( successSwal )
			.catch( tRPCHandleError );
		return !!result;
	};

	const image = useMemo<[string, string]>( () => {
		const images = blueprintPack.blueprints.reduce<[string, string][]>( ( all, curr ) => all.concat( curr.images.map<[string, string]>( e => [ curr._id, e ] ) ), [] );
		return images[ Math.floor( Math.random() * images.length ) ] || [ "", "" ];
	}, [ blueprintPack.blueprints ] );

	const resolvedMods = useMemo<Mod[]>( () => blueprintPack.mods.map( e => mods.find( m => m._id === e )! ).filter( e => !!e ) || [], [ blueprintPack.mods, mods ] );

	return {
		blueprintPack,
		allowedToLike,
		allowedToEdit,
		update,
		remove,
		image,
		owner: blueprintPack.owner,
		blueprints: blueprintPack.blueprints,
		tags: blueprintPack.tags,
		mods: resolvedMods
	};
}
