import {
	useEffect,
	useMemo,
	useState
}                         from "react";
import { API_QueryLib }   from "@applib/Api/API_Query.Lib";
import {
	EApiBlueprintUtils,
	EApiQuestionary,
	EApiUserBlueprints
}                         from "@shared/Enum/EApiPath";
import type {
	MO_Blueprint,
	MO_Mod,
	MO_Tag
}                         from "@shared/Types/MongoDB";
import { EDesignerSize }  from "@shared/Enum/EDesignerSize";
import { ERoles }         from "@shared/Enum/ERoles";
import type { Blueprint } from "@etothepii/satisfactory-file-parser";
import { useAuth }        from "@hooks/useAuth";

export interface IBlueprintHookConfig {
	IgnoreBlacklisted : boolean;
}

export function useBlueprint( InitValue : string | MO_Blueprint, Config? : Partial<IBlueprintHookConfig> ) {
	const [ Blueprint, setBlueprint ] = useState<MO_Blueprint>( () => {
		if ( typeof InitValue === "string" ) {
			return {
				downloads: 0,
				name: "",
				DesignerSize: EDesignerSize.mk1,
				description: "",
				tags: [],
				mods: [],
				likes: [],
				owner: "",
				_id: "",
				__v: 0
			} as MO_Blueprint;
		}
		return InitValue;
	} );
	const [ DoQueryLikes, setDoQueryLikes ] = useState<boolean>( false );
	const { loggedIn, user } = useAuth();
	const [ Mods, setMods ] = useState<MO_Mod[]>( [] );
	const [ Tags, setTags ] = useState<MO_Tag[]>( [] );
	const [ BlueprintData, setBlueprintData ] = useState<Blueprint | undefined>( undefined );

	const BlueprintID = useMemo( () => {
		if ( typeof InitValue === "string" ) {
			return InitValue;
		}
		return InitValue._id;
	}, [ InitValue ] );

	const IsOwner = useMemo( () => {
		return user.Get._id === Blueprint.owner;
	}, [ user.Get._id, Blueprint.owner ] );

	const BlueprintValid = useMemo( () => {
		if ( Config?.IgnoreBlacklisted ) {
			return Blueprint._id !== "";
		}
		return Blueprint._id !== "" && !Blueprint.blacklisted;
	}, [ Blueprint._id, Blueprint.blacklisted, Config?.IgnoreBlacklisted ] );

	const QueryModsAndTags = async() => {
		if ( !BlueprintValid ) {
			return;
		}

		const [ Mods, Tags, BlueprintRead ] = await Promise.all( [
			API_QueryLib.Qustionary<MO_Mod>( EApiQuestionary.mods, { Filter: { mod_reference: { $in: Blueprint.mods } } } ),
			API_QueryLib.Qustionary<MO_Tag>( EApiQuestionary.tags, { Filter: { _id: { $in: Blueprint.tags } } } ),
			API_QueryLib.PostToAPI( EApiBlueprintUtils.readblueprint, { Id: BlueprintID } )
		] );

		setMods( Mods.Data! );
		setTags( Tags.Data! );
		setBlueprintData( BlueprintRead.Data );
	};

	const Query = async() => {
		const Result = await API_QueryLib.Qustionary<MO_Blueprint>( EApiQuestionary.blueprints, { Filter: { _id: BlueprintID } } );
		if ( Result.Data && Result.Data.length > 0 ) {
			setBlueprint( Result.Data[ 0 ] );
			await QueryModsAndTags();
		}
	};

	const AllowToEdit = useMemo( () => {
		if ( loggedIn && BlueprintValid ) {
			return user.HasPermssion( ERoles.admin ) || Blueprint.owner.trim() === user.Get._id.trim();
		}
		return false;
	}, [ user, loggedIn, Blueprint.owner, BlueprintValid ] );

	useEffect( () => {
		Query();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ InitValue, BlueprintValid ] );

	useEffect( () => {
		if ( BlueprintValid ) {
			QueryModsAndTags();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ Blueprint.tags, Blueprint.mods ] );


	const ToggleLike = async() : Promise<void> => {
		if ( !loggedIn ) {
			await API_QueryLib.FireSwal( "Api.error.Unauthorized" );
			return;
		}

		if ( !BlueprintValid ) {
			return;
		}

		setDoQueryLikes( true );
		await API_QueryLib.PostToAPI( EApiUserBlueprints.like, { Id: Blueprint._id } );

		setDoQueryLikes( false );
	};

	const ToggleBlacklist = async() : Promise<boolean> => {
		if ( !loggedIn ) {
			await API_QueryLib.FireSwal( "Api.error.Unauthorized" );
			return false;
		}

		if ( !BlueprintValid ) {
			return false;
		}

		setDoQueryLikes( true );
		const Result = await API_QueryLib.PostToAPI( EApiUserBlueprints.blacklist, { Id: Blueprint._id } );
		setDoQueryLikes( false );
		return Result.Success;
	};

	const Remove = async() : Promise<boolean> => {
		if ( !loggedIn ) {
			await API_QueryLib.FireSwal( "Api.error.Unauthorized" );
			return false;
		}

		if ( !BlueprintValid ) {
			return false;
		}

		setDoQueryLikes( true );
		const Result = await API_QueryLib.PostToAPI( EApiUserBlueprints.remove, { Id: Blueprint._id } );
		setDoQueryLikes( false );
		return Result.Success;
	};

	return {
		IsOwner,
		Remove,
		ToggleBlacklist,
		BlueprintData,
		Mods,
		Tags,
		AllowToLike: loggedIn && Blueprint.owner !== user.Get._id,
		AllowToEdit,
		BlueprintValid,
		Update: Query,
		Blueprint,
		BlueprintID,
		UpdateBlueprintCache: setBlueprint,
		ToggleLike,
		DoQueryLikes
	};
}