import React, {
	ChangeEvent,
	FormEvent,
	FunctionComponent,
	useContext,
	useEffect,
	useState
}                         from "react";
import { useAuthCheck }   from "../hooks/useAuthCheck";
import { useNavigate }    from "react-router-dom";
import LangContext        from "../Context/LangContext";
import FloatInput         from "../Components/Boostrap/FloatInput";
import LoadingButton      from "../Components/Boostrap/LoadingButton";
import FloatTextarea      from "../Components/Boostrap/FloatTextarea";
import ReactMarkdown      from "react-markdown";
import FileUploadInput    from "../Components/Boostrap/FileUploadInput";
import { API_QueryLib }   from "../Lib/Api/API_Query.Lib";
import {
	EApiBlueprintUtils,
	EApiTags,
	EApiUserBlueprints
}                         from "../Shared/Enum/EApiPath";
import { Blueprint }      from "@etothepii/satisfactory-file-parser";
import {
	Button,
	InputGroup
}                         from "react-bootstrap";
import Select, {
	MultiValue,
	SingleValue
}                         from "react-select";
import {
	TResponse_Tags_Mods,
	TResponse_Tags_Tags
}                         from "../Shared/Types/API_Response";
import { IModTagOptions } from "../Shared/Types/SelectOptions";
import { EDesignerSize }  from "../Shared/Enum/EDesignerSize";

export interface IFile {
	Content : FileList | undefined,
	FileName : string
}

const CreateBlueprint : FunctionComponent = () => {
	const { Lang } = useContext( LangContext );
	const { AuthCheckProps, AuthCheck } = useAuthCheck( { Auth: true, RedirectTo: "/signin" } );
	const [ IsSending, setIsSending ] = useState( false );
	const Navigate = useNavigate();

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

	const [ CanImport, setCanImport ] = useState( false );
	const [ BlueprintData, setBlueprintData ] = useState<Blueprint | undefined>( undefined );

	const [ SBP, setSBP ] = useState<File | undefined>();
	const [ SBPCFG, setSBPCFG ] = useState<File | undefined>();
	const [ Image, setImage ] = useState<File | undefined>();

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

	const HandleImport = async() => {
		if ( BlueprintData ) {
			setBlueprintName( BlueprintData.name );
			setBlueprintDesc( BlueprintData.config.description );
		}
	};

	const HandleFullBlueprint = async() => {
		if (
			SBPCFG && SBP &&
			SBPCFG.name.replace( ".sbpcfg", "" ) === SBP.name.replace( ".sbp", "" )
		) {
			const data = new FormData();
			data.append( "BlueprintName", SBPCFG.name.replace( ".sbpcfg", "" ).replace( "_", " " ) );
			data.append( "files", SBP );
			data.append( "files", SBPCFG );
			const Result = await API_QueryLib.PostToAPI( EApiBlueprintUtils.parseblueprint, data );
			return Result.Data as Blueprint;
		}
		else {

		}
	};

	const CheckInput = () => {
		return SBP && SBPCFG && Image && BlueprintDesc.length >= 50 && BlueprintName.length >= 5;
	};

	const HandleSubmit = async( e : FormEvent<HTMLFormElement> ) => {
		e.preventDefault();
		setIsSending( true );

		if ( CheckInput() ) {
			const data = new FormData();
			data.append( "BlueprintName", BlueprintName );
			data.append( "BlueprintDesc", BlueprintDesc );
			for ( const Tag of Tags ) {
				data.append( "BlueprintTags", Tag.value );
			}
			for ( const Mod of Mods ) {
				data.append( "BlueprintMods", Mod.value );
			}
			data.append( "SBP", SBP! );
			data.append( "SBPCFG", SBPCFG! );
			data.append( "Image", Image! );
			data.append( "DesignerSize", DesignerSize!.value );
			const Result = await API_QueryLib.PostToAPI( EApiUserBlueprints.create, data );
			if ( Result.Success ) {
				const ID = Result.Data as string;
				Navigate( `/blueprint/${ ID }` );
			}
		}
		else {
			await API_QueryLib.FireSwal( "Reg_Invalid_Input" );
		}

		setIsSending( false );
	};

	useEffect( () => {
		HandleFullBlueprint().then( R => {
			setBlueprintData( R );
			setCanImport( R !== undefined );
		} );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ SBP, SBPCFG ] );

	const HandleChange = ( e : ChangeEvent<HTMLInputElement> ) => {
		const File = e.target.files![ 0 ];

		if ( !File || !File.name ) {
			return;
		}

		switch ( e.target.name ) {
			case "sbp":
				if ( File && File.name.endsWith( ".sbp" ) ) {
					setSBP( () => File );
				}
				break;
			case "sbpcfg":
				if ( File && File.name.endsWith( ".sbpcfg" ) ) {
					setSBPCFG( () => File );
				}
				break;
			case "image":
				if ( File && File.name.endsWith( ".jpg" ) ) {
					setImage( () => File );
				}
				break;
			default:
				break;
		}
	};

	return (
		<AuthCheck { ...AuthCheckProps }>
			<div className={ "d-flex h-100 justify-content-center" }>
				<form onSubmit={ HandleSubmit }
				      className={ "align-self-center bg-gray-800 p-4 border rounded-4 w-100" }>
					<h2>{ Lang.Navigation.AddBlueprint }</h2>
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
					<FileUploadInput BoxClassName={ "mb-3" } accept=".sbp" onChange={ HandleChange } name={ "sbp" }
					                 type="file">{ Lang.CreateBlueprint.File1 }</FileUploadInput>
					<FileUploadInput BoxClassName={ "mb-3" } accept=".sbpcfg" onChange={ HandleChange }
					                 name={ "sbpcfg" }
					                 type="file">{ Lang.CreateBlueprint.File2 }</FileUploadInput>
					<FileUploadInput BoxClassName={ "mb-3" } type="file" onChange={ HandleChange } name={ "image" }
					                 accept=".jpg,.jpeg">{ Lang.CreateBlueprint.Image }</FileUploadInput>
					<hr/>
					<LoadingButton variant={ "success" } type={ "submit" }
					               disabled={ !CheckInput() }
					               IsLoading={ IsSending }>{ Lang.CreateBlueprint.Submit }</LoadingButton>
					<Button className={ "ms-2" } disabled={ !CanImport }
					        onClick={ HandleImport }>{ Lang.CreateBlueprint.ImportFromFiles }</Button>
				</form>
			</div>
		</AuthCheck>
	);
};

export default CreateBlueprint;
