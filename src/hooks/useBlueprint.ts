import DataContext from "@app/Context/DataContext";
import { fireSwalFromApi, onConfirm, successSwal, tRPCAuth, tRPCHandleError, tRPCPublic } from "@app/Lib/tRPC";
import type { Blueprint } from "@etothepii/satisfactory-file-parser";
import { useAuth } from "@hooks/useAuth";
import type { Mod } from "@kyri123/lib";
import type { BlueprintData } from "@server/MongoDB/MongoBlueprints";
import type { Tag } from "@server/MongoDB/MongoTags";
import { EDesignerSize } from "@shared/Enum/EDesignerSize";
import { ERoles } from "@shared/Enum/ERoles";
import _ from "lodash";
import {
	useContext,
	useEffect,
	useMemo,
	useState
} from "react";


export interface IBlueprintHookConfig {
	blueprint: Blueprint
}

export function useBlueprint( InitValue: string | BlueprintData, defaultUser?: { id: string, username: string }, Config?: Partial<IBlueprintHookConfig> ) {
	const { mods, tags } = useContext( DataContext );
	const [ Blueprint, setBlueprint ] = useState<BlueprintData>( () => {
		if( typeof InitValue === "string" ) {
			return {
				downloads: 0,
				name: "",
				DesignerSize: EDesignerSize.mk1,
				description: "",
				tags: [],
				mods: [],
				likes: [],
				owner: "",
				_id: ""
			} as unknown as BlueprintData;
		}
		return InitValue as BlueprintData;
	} );
	const { loggedIn, user } = useAuth();
	const [ DoQueryLikes, setDoQueryLikes ] = useState<boolean>( false );
	const [ blueprintParse, setBlueprintData ] = useState<Blueprint | undefined>( Config?.blueprint );
	const [ Tags, setTags ] = useState<Tag[]>( [] );
	const [ Mods, setMods ] = useState<Mod[]>( [] );
	const [ owner, setOwner ] = useState<{ id: string, username: string }>( () => defaultUser || { id: "", username: "" } );

	const BlueprintID = useMemo( () => {
		if( typeof InitValue === "string" ) {
			return InitValue;
		}
		return InitValue._id;
	}, [ InitValue ] );

	const isOwner = useMemo( () => user.Get._id === owner.id, [ owner.id, user.Get._id ] );

	const isValid = useMemo( () => Blueprint._id !== "", [ Blueprint._id ] );

	const updateData = ( newData?: BlueprintData ) => {
		const blueprintParse = newData || Blueprint;
		setTags( tags.filter( e => blueprintParse.tags.includes( e._id ) ) );
		setMods( mods.filter( e => blueprintParse.mods.includes( e.mod_reference ) ) );
	};

	const QueryBlueprintParse = async() => {
		const Result = await tRPCPublic.blueprint.readBlueprint.mutate( { blueprintId: BlueprintID } ).catch( () => {} );

		if( Result ) {
			setBlueprintData( Result );
		}
	};

	const Query = async() => {
		const [ blueprintParse, Result ] = await Promise.all( [
			tRPCPublic.blueprint.readBlueprint.mutate( { blueprintId: BlueprintID } ).catch( () => {} ),
			tRPCPublic.blueprint.getBlueprint.query( { blueprintId: BlueprintID } ).catch( () => {} )
		] );
		blueprintParse && setBlueprintData( blueprintParse );
		if( Result ) {
			setOwner( { id: Result.blueprintData.owner, username: Result.bpOwnerName } );
			updateData( Result.blueprintData );
			setBlueprint( Result.blueprintData );
		}
	};

	const allowedToEdit = useMemo( () => {
		if( loggedIn && ( isValid ) ) {
			return user.HasPermission( ERoles.admin ) || _.isEqual( Blueprint.owner.toString(), user.Get._id );
		}
		return false;
	}, [ loggedIn, isValid, Blueprint.owner, user ] );

	useEffect( () => {
		if( typeof InitValue === "string" || !defaultUser ) {
			Query();
		} else {
			QueryBlueprintParse();
			updateData( Blueprint );
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ InitValue ] );

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect( updateData, [ InitValue, isValid ] );

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect( updateData, [ Blueprint.tags, Blueprint.mods ] );

	const remove = async(): Promise<boolean> => {
		if( !loggedIn ) {
			await fireSwalFromApi( "You need to be logged in to do this!", "error" );
			return false;
		}

		if( !allowedToEdit ) {
			return false;
		}

		if( await onConfirm( "Do you really want to remove that Blueprint?" ) ) {
			const result = await tRPCAuth.blueprints.deleteBlueprint.mutate( { blueprintId: BlueprintID } )
				.then( successSwal )
				.catch( tRPCHandleError );

			return !!result;
		}
		return false;
	};

	const allowedToLike = useMemo( () => ( loggedIn && !_.isEqual( Blueprint.owner.toString(), user.Get._id ) ), [ loggedIn, Blueprint.owner, user ] );

	return {
		owner,
		isOwner,
		remove,
		blueprintParse,
		Mods,
		Tags,
		allowedToLike,
		allowedToEdit,
		isValid,
		Update: Query,
		Blueprint,
		BlueprintID,
		DoQueryLikes
	};
}
