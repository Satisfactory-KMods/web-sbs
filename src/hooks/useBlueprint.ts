import DataContext from "@app/Context/DataContext";
import { fireSwalFromApi, tRPC_Public } from "@app/Lib/tRPC";
import { API_QueryLib } from "@applib/Api/API_Query.Lib";
import type { Blueprint } from "@etothepii/satisfactory-file-parser";
import { useAuth } from "@hooks/useAuth";
import type { Mod } from "@kyri123/lib";
import type { BlueprintData } from "@server/MongoDB/DB_Blueprints";
import type { Tag } from "@server/MongoDB/DB_Tags";
import {
	EApiUserBlueprints
} from "@shared/Enum/EApiPath";
import { EDesignerSize } from "@shared/Enum/EDesignerSize";
import { ERoles } from "@shared/Enum/ERoles";
import {
	useContext,
	useEffect,
	useMemo,
	useState
} from "react";

export interface IBlueprintHookConfig {
	IgnoreBlacklisted: boolean;
}

export function useBlueprint( InitValue: string | BlueprintData, Config?: Partial<IBlueprintHookConfig> ) {
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
	const [ blueprintData, setBlueprintData ] = useState<Blueprint | undefined>( undefined );
	const [ Tags, setTags ] = useState<Tag[]>( [] );
	const [ Mods, setMods ] = useState<Mod[]>( [] );
	const [ owner, setOwner ] = useState<{ id: string, username: string }>( { id: "", username: "" } );

	const BlueprintID = useMemo( () => {
		if( typeof InitValue === "string" ) {
			return InitValue;
		}
		return InitValue._id;
	}, [ InitValue ] );

	const isOwner = useMemo( () => {
		return user.Get._id === owner.id;
	}, [ owner.id, user.Get._id ] );

	const isValid = useMemo( () => {
		if( Config?.IgnoreBlacklisted ) {
			return Blueprint._id !== "";
		}
		return Blueprint._id !== "" && !Blueprint.blacklisted;
	}, [ Blueprint._id, Blueprint.blacklisted, Config?.IgnoreBlacklisted ] );

	const updateData = ( newData?: BlueprintData ) => {
		const blueprintData = newData || Blueprint;
		setTags( tags.filter( e => blueprintData.tags.includes( e._id ) ) );
		setMods( mods.filter( e => blueprintData.mods.includes( e.id ) ) );
	};

	const Query = async() => {
		const [ blueprintData, Result ] = await Promise.all( [
			tRPC_Public.blueprint.readBlueprint.mutate( { blueprintId: BlueprintID } ).catch( () => {} ),
			tRPC_Public.blueprint.getBlueprint.query( { blueprintId: BlueprintID } ).catch( () => {} )
		] );
		console.log( Result );
		blueprintData && setBlueprintData( blueprintData );
		if( Result ) {
			setOwner( { id: Result.blueprintData.owner, username: Result.bpOwnerName } );
			updateData( Result.blueprintData );
			setBlueprint( Result.blueprintData );
		}
	};

	const allowedToEdit = useMemo( () => {
		if( loggedIn && isValid ) {
			return user.HasPermission( ERoles.admin ) || Blueprint.owner.trim() === user.Get._id.trim();
		}
		return false;
	}, [ user, loggedIn, Blueprint.owner, isValid ] );

	useEffect( () => {
		Query();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect( updateData, [ InitValue, isValid ] );

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect( updateData, [ Blueprint.tags, Blueprint.mods ] );

	const ToggleLike = async(): Promise<void> => {
		if( !loggedIn ) {
			await fireSwalFromApi( "You need to be logged in to do this!", "error" );
			return;
		}

		if( !isValid ) {
			return;
		}

		setDoQueryLikes( true );
		await API_QueryLib.PostToAPI( EApiUserBlueprints.like, { Id: Blueprint._id } );

		setDoQueryLikes( false );
	};

	const toggleBlacklist = async(): Promise<boolean> => {
		if( !loggedIn ) {
			await fireSwalFromApi( "You need to be logged in to do this!", "error" );
			return false;
		}

		if( !isValid ) {
			return false;
		}

		setDoQueryLikes( true );
		const Result = await API_QueryLib.PostToAPI( EApiUserBlueprints.blacklist, { Id: Blueprint._id } );
		setDoQueryLikes( false );
		return Result.Success;
	};

	const remove = async(): Promise<boolean> => {
		if( !loggedIn ) {
			await fireSwalFromApi( "You need to be logged in to do this!", "error" );
			return false;
		}

		if( !isValid ) {
			return false;
		}

		setDoQueryLikes( true );
		const Result = await API_QueryLib.PostToAPI( EApiUserBlueprints.remove, { Id: Blueprint._id } );
		setDoQueryLikes( false );
		return Result.Success;
	};

	return {
		owner,
		isOwner,
		remove,
		toggleBlacklist,
		blueprintData,
		Mods,
		Tags,
		allowedToLike: loggedIn && Blueprint.owner !== user.Get._id,
		allowedToEdit,
		isValid,
		Update: Query,
		Blueprint,
		BlueprintID,
		UpdateBlueprintCache: setBlueprint,
		ToggleLike,
		DoQueryLikes
	};
}