import React, {
	ChangeEvent,
	FormEvent,
	FunctionComponent,
	useContext,
	useEffect,
	useState
}                         from "react";
import { useAuthCheck }   from "../../hooks/useAuthCheck";
import LangContext        from "../../Context/LangContext";
import {
	Navigate,
	useNavigate,
	useParams
}                         from "react-router-dom";
import Select, {
	MultiValue,
	SingleValue
}                         from "react-select";
import { IModTagOptions } from "../../Shared/Types/SelectOptions";
import { EDesignerSize }  from "../../Shared/Enum/EDesignerSize";
import { API_QueryLib }   from "../../Lib/Api/API_Query.Lib";
import {
	TResponse_Tags_Mods,
	TResponse_Tags_Tags
}                         from "../../Shared/Types/API_Response";
import {
	EApiTags,
	EApiUserBlueprints
}                         from "../../Shared/Enum/EApiPath";
import FloatInput         from "../../Components/Boostrap/FloatInput";
import FloatTextarea      from "../../Components/Boostrap/FloatTextarea";
import ReactMarkdown      from "react-markdown";
import {
	Button,
	InputGroup
}                         from "react-bootstrap";
import FileUploadInput    from "../../Components/Boostrap/FileUploadInput";
import LoadingButton      from "../../Components/Boostrap/LoadingButton";
import { useBlueprint }   from "../../hooks/useBlueprint";

const EditBlueprint : FunctionComponent = () => {
	const { id } = useParams();
	const { Blueprint, AllowToEdit, BlueprintValid, ...BP } = useBlueprint( id! );
	const { Lang } = useContext( LangContext );
	const { AuthCheckProps, AuthCheck } = useAuthCheck( { Auth: true, RedirectTo: "/account/signin" } );
	const [ IsSending, setIsSending ] = useState( false );
	const Nav = useNavigate();

	const [ BlueprintName, setBlueprintName ] = useState( "" );
	const [ BlueprintDesc, setBlueprintDesc ] = useState( "" );

	const [ Tags, setTags ] = useState<MultiValue<IModTagOptions>>( [] );
	const [ Mods, setMods ] = useState<MultiValue<IModTagOptions>>( [] );
	const [ DesignerSize, setDesignerSize ] = useState<SingleValue<IModTagOptions<EDesignerSize>>>( {
		value: EDesignerSize.mk1,
		label: EDesignerSize.mk1
	} );

	const [ SelectTags, setSelectTags ] = useState<IModTagOptions[]>( [] );
	const [ SelectMods, setSelectMods ] = useState<IModTagOptions[]>( [] );

	const [ Image, setImage ] = useState<File | undefined>();

	// load blueprint data
	useEffect( () => {
		setBlueprintName( () => Blueprint.name );
		setBlueprintDesc( () => Blueprint.description );
		setDesignerSize( () => ( {
			value: Blueprint.DesignerSize,
			label: Blueprint.DesignerSize
		} ) );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ BlueprintValid ] );

	// load selected Tags
	useEffect( () => {
		setTags( () => BP.Tags.map( R => ( {
			value: R._id,
			label: R.DisplayName
		} ) ) );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ BP.Tags ] );

	// load selected Mods
	useEffect( () => {
		setMods( () => BP.Mods.map( R => ( {
			value: R.mod_reference,
			label: R.name
		} ) ) );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ BP.Mods ] );

	// load all mods and tags
	useEffect( () => {
		Promise.all( [
			API_QueryLib.PostToAPI<TResponse_Tags_Tags>( EApiTags.tags, {} ).then( R => setSelectTags( R.Data?.map( R => ( {
				label: R.DisplayName,
				value: R._id
			} ) ) || [] ) ),
			API_QueryLib.PostToAPI<TResponse_Tags_Mods>( EApiTags.mods, {} ).then( R => setSelectMods( R.Data?.map( R => ( {
				label: R.name,
				value: R.mod_reference
			} ) ) || [] ) )
		] );
	}, [] );

	const CheckInput = () => {
		return BlueprintDesc.length >= 50 && BlueprintName.length >= 5;
	};

	const HandleSubmit = async( e : FormEvent<HTMLFormElement> ) => {
		e.preventDefault();
		setIsSending( true );

		if ( CheckInput() ) {
			const data = new FormData();
			data.append( "BlueprintId", id! );
			data.append( "BlueprintName", BlueprintName );
			data.append( "BlueprintDesc", BlueprintDesc );
			for ( const Tag of Tags ) {
				data.append( "BlueprintTags", Tag.value );
			}
			for ( const Mod of Mods ) {
				data.append( "BlueprintMods", Mod.value );
			}

			if ( Image ) {
				data.append( "Image", Image );
			}
			data.append( "DesignerSize", DesignerSize!.value );
			const Result = await API_QueryLib.PostToAPI( EApiUserBlueprints.edit, data );
			if ( Result.Success ) {
				const ID = Result.Data as string;
				Nav( `/blueprint/${ ID }` );
			}
		}
		else {
			await API_QueryLib.FireSwal( "Reg_Invalid_Input" );
		}

		setIsSending( false );
	};

	const HandleChange = ( e : ChangeEvent<HTMLInputElement> ) => {
		const File = e.target.files![ 0 ];
		if ( !File || !File.name ) {
			return;
		}
		switch ( e.target.name ) {
			case "image":
				setImage( () => File );
				break;
		}
	};

	if ( !BlueprintValid ) {
		return <></>;
	}

	if ( !AllowToEdit ) {
		return <Navigate to="/error/401"/>;
	}

	return (
		<AuthCheck { ...AuthCheckProps }>
			<div className={ "d-flex h-100 justify-content-center" }>
				<form onSubmit={ HandleSubmit }
				      className={ "align-self-center bg-gray-800 p-4 border rounded-4 w-100" }>
					<h2>{ Lang.EditBlueprint.Title }</h2>
					<hr/>
					<FloatInput className={ "mb-3" } onChange={ E => setBlueprintName( E.target.value ) }
					            value={ BlueprintName }>{ Lang.CreateBlueprint.BlueprintName }</FloatInput>
					<div className={ "d-flex mb-3" }>
						<FloatTextarea className={ "h-100 me-3" } style={ { minHeight: 500 } }
						               onChange={ E => setBlueprintDesc( E.target.value ) } value={ BlueprintDesc }
						               lableClassName={ "flex-1" }>{ Lang.CreateBlueprint.BlueprintDescripton }</FloatTextarea>
						<div className={ "ms-3 flex-1 border rounded p-2 bg-dark" }>
							<ReactMarkdown>{ BlueprintDesc }</ReactMarkdown>
						</div>
					</div>
					<InputGroup className={ "mb-3" }>
						<InputGroup.Text className="text-bg-dark">{ Lang.CreateBlueprint.Mods }</InputGroup.Text>
						<Select options={ SelectMods } isMulti={ true } value={ Mods } onChange={ setMods }
						        isClearable={ true }

						        className="my-react-select-container flex-1" classNamePrefix="my-react-select"/>
					</InputGroup>
					<InputGroup className={ "mb-3" }>
						<InputGroup.Text className="text-bg-dark">{ Lang.CreateBlueprint.Tags }</InputGroup.Text>
						<Select options={ SelectTags } isMulti={ true } value={ Tags } onChange={ setTags }
						        isClearable={ true }
						        className="my-react-select-container flex-1" classNamePrefix="my-react-select"/>
					</InputGroup>
					<InputGroup className={ "mb-3" }>
						<InputGroup.Text
							className="text-bg-dark">{ Lang.CreateBlueprint.DesignerSize }</InputGroup.Text>
						<Select isClearable={ false } options={ Object.values( EDesignerSize ).map( R => ( {
							value: R,
							label: R
						} as IModTagOptions<EDesignerSize> ) ) } value={ DesignerSize } onChange={ setDesignerSize }
						        className="my-react-select-container flex-1" classNamePrefix="my-react-select"/>
					</InputGroup>
					<FileUploadInput BoxClassName={ "mb-3" } type="file" onChange={ HandleChange } name={ "image" }
					                 accept=".jpg,.jpeg,.png">{ Lang.CreateBlueprint.Image }</FileUploadInput>
					<hr/>
					<LoadingButton variant={ "success" } type={ "submit" }
					               disabled={ !CheckInput() }
					               IsLoading={ IsSending }>{ Lang.EditBlueprint.Submit }</LoadingButton>
					<Button variant={ "secondary" } type={ "button" } className={ "ms-2" }
					        onClick={ () => Nav( `/blueprint/${ id }` ) }>{ Lang.EditBlueprint.Back }</Button>
				</form>
			</div>
		</AuthCheck>
	);
};

export default EditBlueprint;
