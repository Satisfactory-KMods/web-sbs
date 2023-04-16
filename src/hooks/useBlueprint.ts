import {
	useContext,
	useEffect,
	useMemo,
	useState
}                           from "react";
import { API_QueryLib }     from "../Lib/Api/API_Query.Lib";
import {
	EApiBlueprint,
	EApiUserBlueprints
}                           from "../Shared/Enum/EApiPath";
import { IMO_Blueprint }    from "../Shared/Types/MongoDB";
import { EDesignerSize }    from "../Shared/Enum/EDesignerSize";
import { TResponse_BP_Get } from "../Shared/Types/API_Response";
import { TRequest_BP_Get }  from "../Shared/Types/API_Request";
import AuthContext          from "../Context/AuthContext";
import { GetSocket }        from "../Lib/SocketIO";

export function useBlueprint( InitValue : string | IMO_Blueprint ) {
	const [ Blueprint, setBlueprint ] = useState<IMO_Blueprint>( () => {
		if ( typeof InitValue === "string" ) {
			return {
				name: "",
				DesignerSize: EDesignerSize.mk1,
				description: "",
				tags: [],
				mods: [],
				likes: [],
				owner: "",
				_id: "",
				__v: 0
			} as IMO_Blueprint;
		}
		return InitValue as IMO_Blueprint;
	} );
	const [ DoQueryLikes, setDoQueryLikes ] = useState<boolean>( false );
	const { IsLoggedIn } = useContext( AuthContext );

	const BlueprintID = useMemo( () => {
		if ( typeof InitValue === "string" ) {
			return InitValue;
		}
		return InitValue._id;
	}, [ InitValue ] );

	const BlueprintValid = useMemo( () => {
		return Blueprint._id !== "";
	}, [ InitValue ] );

	const Query = async() => {
		const Result = await API_QueryLib.PostToAPI<TResponse_BP_Get, TRequest_BP_Get>( EApiBlueprint.get, { Filter: { _id: BlueprintID } } );
		if ( Result.Data && Result.Data.length > 0 ) {
			setBlueprint( () => Result.Data![ 0 ] );
		}
	};

	useEffect( () => {
		Query();
	}, [ InitValue ] );

	useEffect( () => {
		const SocketIO = GetSocket( BlueprintID );
		SocketIO.on( "BlueprintUpdated", setBlueprint );
		return () => {
			SocketIO.off( "BlueprintUpdated", setBlueprint );
			SocketIO.close();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	const ToggleLike = async() : Promise<string[]> => {
		if ( !IsLoggedIn ) {
			await API_QueryLib.FireSwal( "NotLoggedIn" );
			return [];
		}

		if ( !BlueprintValid ) {
			return [];
		}

		setDoQueryLikes( true );
		const Form = new FormData();
		Form.append( "Id", Blueprint._id );
		const Result = await API_QueryLib.PostToAPI( EApiUserBlueprints.like, Form );

		if ( Result.Success && Result.Data ) {
			setDoQueryLikes( false );
			return Result.Data;
		}
		setDoQueryLikes( false );
		return [];
	};

	return {
		Update: Query,
		Blueprint,
		BlueprintID,
		UpdateBlueprintCache: setBlueprint,
		ToggleLike,
		DoQueryLikes
	};
}