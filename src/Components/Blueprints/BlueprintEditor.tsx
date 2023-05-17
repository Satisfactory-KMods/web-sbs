import BlueprintEditorCheckList from "@app/Components/Blueprints/BlueprintEditorCheckList";
import { SBSInput, SBSSelect } from "@app/Components/elements/Inputs";
import DataContext from "@app/Context/DataContext";
import { apiQueryLib } from "@app/Lib/Api/API_Query.Lib";
import { successSwalAwait } from "@app/Lib/tRPC";
import { mdxComponents } from "@app/Page/terms/private/Page";
import { EApiBlueprintUtils } from "@app/Shared/Enum/EApiPath";
import { EDesignerSize } from "@app/Shared/Enum/EDesignerSize";
import type { SelectOptionStruct } from "@app/Shared/Types/SelectOptions";
import { findModsFromBlueprint } from "@app/Shared/blueprintReadingHelper";
import { useAuth } from "@app/hooks/useAuth";
import { useSelectOptions } from "@app/hooks/useSelectOptions";
import { LoadingButton } from "@comp/elements/Buttons";
import type { Blueprint, SaveComponent, SaveEntity } from "@etothepii/satisfactory-file-parser";
import type { Mod } from "@kyri123/lib";
import type { BlueprintData } from "@server/MongoDB/MongoBlueprints";
import type { Tag } from "@server/MongoDB/MongoTags";
import { Button, Label, Textarea } from "flowbite-react";
import _ from "lodash";
import type { ChangeEventHandler, FunctionComponent } from "react";
import { useContext, useEffect, useId, useMemo, useState } from "react";
import { BiSave, BiTag, BiUser, BiWrench } from "react-icons/bi";
import { BsBox, BsBoxes, BsHouseAdd } from "react-icons/bs";
import { MdOutlinePhotoSizeSelectSmall } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate } from "react-router-dom";
import type { MultiValue, SingleValue } from "react-select";
import Select from "react-select";


interface BlueprintEditorProps {
	defaultData?: BlueprintData
	defaultBlueprintData?: Blueprint
}

const BlueprintEditor: FunctionComponent<BlueprintEditorProps> = ( { defaultData, defaultBlueprintData } ) => {
	const id = useId();
	const navigate = useNavigate();
	const { user } = useAuth();
	const { mods, tags } = useContext( DataContext );
	const { tagsSelectOptions, tagSelectedMulti, designerSizeOptions, designerSizeSingle } = useSelectOptions();
	const [ form, setForm ] = useState<Omit<BlueprintData, "__v" | "_id" | "createdAt" | "updatedAt">>( () => {
		const defaultCopy: Partial<BlueprintData> | undefined = _.cloneDeep( defaultData );
		if( defaultCopy ) {
			delete defaultCopy.__v;
			delete defaultCopy._id;
			delete defaultCopy.createdAt;
			delete defaultCopy.updatedAt;
		}
		// todo: fells bad/wrong :/
		return defaultCopy as Omit<BlueprintData, "__v" | "_id" | "createdAt" | "updatedAt"> || {
			name: "",
			description: "",
			owner: user.Get._id,
			DesignerSize: EDesignerSize.mk1,
			mods: [],
			rating: [],
			totalRating: 0,
			tags: [],
			images: [],
			downloads: 0
		};
	} );
	const [ isUploading, setIsUploading ] = useState<boolean>( false );
	const [ blueprintParse, setBlueprintParse ] = useState<Blueprint | undefined>( () => defaultBlueprintData );
	const [ sbpFile, setSbpFile ] = useState<File | null>( () => null );
	const [ sbpcfgFile, setSbpcfgFile ] = useState<File | null>( () => null );
	const [ images, setImages ] = useState<FileList | null>( () => null );
	const [ DesignerSize, setDesignerSize ] = useState<SingleValue<SelectOptionStruct<EDesignerSize>>>( designerSizeSingle( defaultData?.DesignerSize || EDesignerSize.mk1 ) );
	const [ formTags, setTags ] = useState<MultiValue<SelectOptionStruct>>( tagSelectedMulti( defaultData?.tags || [] ) );

	const isEditing = !!defaultData;

	const Mods: Mod[] = useMemo( () => {
		const modRefs = findModsFromBlueprint( blueprintParse?.objects );
		return mods.filter( e => modRefs.includes( e.mod_reference ) );
	}, [ blueprintParse?.objects, mods ] );

	const Tags: Tag[] = useMemo( () => tags.filter( e => form.tags.includes( e._id ) ), [ form.tags, tags ] );

	const buildingCount = useMemo( () => {
		const objects: ( SaveEntity | SaveComponent )[] = blueprintParse?.objects || [];
		return objects.filter( e => e.type === "SaveEntity" ).length;
	}, [ blueprintParse?.objects ] );

	const totalItemCost = useMemo( () => {
		const itemCosts: [string, number][] = blueprintParse?.header.itemCosts || [];
		return itemCosts.reduce( ( total, cost ) => total + cost[ 1 ], 0 );
	}, [ blueprintParse?.header.itemCosts ] );

	// smallHelper function to set form values
	function setKey<K extends keyof BlueprintData>( key: K, value: BlueprintData[K] ) {
		setForm( curr => ( {
			...curr,
			[ key ]: value
		} ) );
	}

	const handleFileSelect: ChangeEventHandler<HTMLInputElement> = e => {
		switch ( e.target.name ) {
			case "sbp":
				if( !e.target.files || !e.target.files[ 0 ].name.endsWith( ".sbp" ) ) {
					setSbpFile( null );
					return;
				}
				setSbpFile( e.target.files[ 0 ] );
				return;
			case "sbpcfg":
				if( !e.target.files || !e.target.files[ 0 ].name.endsWith( ".sbpcfg" ) ) {
					setSbpcfgFile( null );
					return;
				}
				setSbpcfgFile( e.target.files[ 0 ] );
				return;
			default:
				setImages( e.target.files );
				return;
		}
	};

	const exportDatas = () => {
		if( blueprintParse ) {
			setKey( "name", blueprintParse.name );
			setKey( "description", blueprintParse.config.description );
		}
	};

	useEffect( () => {
		if( sbpFile && sbpcfgFile ) {
			if( !_.isEqual( sbpFile.name.replace( ".sbp", "" ), sbpcfgFile.name.replace( ".sbpcfg", "" ) ) ) {
				setBlueprintParse( defaultBlueprintData );
				return;
			}
			const formData = new FormData();
			formData.append( "blueprint", sbpFile );
			formData.append( "blueprint", sbpcfgFile );
			formData.append( "blueprintName", sbpFile.name.replace( ".sbp", "" ) );
			apiQueryLib.PostToAPI<Blueprint>( EApiBlueprintUtils.parseblueprint, formData )
				.then( e => {
					setBlueprintParse( e );
					setKey( "mods", findModsFromBlueprint( e.objects ) );
				} );
			return;
		}
		setBlueprintParse( defaultBlueprintData );
	}, [ defaultBlueprintData, sbpFile, sbpcfgFile ] );

	// [ title, description, sameblueprint, image(s), tag(s) ]
	const checkList = useMemo( () => {
		const checklist: boolean[] = [
			form.name.length > 0,
			form.description.length > 0,
			false,
			false,
			!!tags.length ];
		if( sbpFile && sbpcfgFile ) {
			checklist[ 2 ] = sbpFile.name.replace( ".sbp", "" ) === sbpcfgFile.name.replace( ".sbpcfg", "" );
		}
		if( images && images.length > 0 ) {
			checklist[ 3 ] = images.length <= 5;
		}
		return checklist;
	}, [ form.description.length, form.name.length, images, sbpFile, sbpcfgFile, tags.length ] );

	const uploadBlueprint = async() => {
		setIsUploading( true );
		if( isEditing ) {
			const data: FormData = new FormData();

			if( checkList[ 2 ] && sbpFile && sbpcfgFile ) {
				data.append( "sbp", sbpFile );
				data.append( "sbpcfg", sbpcfgFile );
			}
			if( checkList[ 3 ] && images ) {
			 	for( const file of images ) {
					data.append( "images", file );
				}
			}
			data.append( "blueprintId", defaultData!._id );
			data.append( "blueprint", JSON.stringify( form ) );

			//FormData_append_object( data, form, "blueprint" );
			await apiQueryLib.PostToAPI<{ msg: string, blueprintId: string }>( EApiBlueprintUtils.edit, data, data instanceof FormData ? "multipart/form-data" : "application/json" )
				.then( async response => {
					await successSwalAwait( response.msg );
					navigate( `/blueprint/${ response.blueprintId }` );
				} )
				.catch( () => {} );
		} else {
			if( !!sbpFile && !!sbpcfgFile && !!images ) {
				const data = new FormData();
				data.append( "sbp", sbpFile );
				data.append( "sbpcfg", sbpcfgFile );
				for( const file of images ) {
					data.append( "images", file );
				}
				data.append( "blueprint", JSON.stringify( form ) );
				await apiQueryLib.PostToAPI<{ msg: string, blueprintId: string }>( EApiBlueprintUtils.create, data )
					.then( async response => {
						await successSwalAwait( response.msg );
						navigate( `/blueprint/${ response.blueprintId }` );
					} )
					.catch( () => {} );
			}
		}
		setIsUploading( false );
	};

	return (
		<>
			<div className="grid grid-cols-1 xl:grid-cols-5 gap-3">
				<div className="xl:col-span-3 flex flex-col w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
					<div className="relative p-3 border-b bg-gray-700 border-gray-700 rounded-t-lg text-neutral-200 truncate text-ellipsis overflow-hidden">
						<span className="text-2xl">
							{ isEditing ? "Edit Blueprint" : "New Blueprint" }
						</span>
						<div className="absolute top-0 right-0 m-3">
							<div className="bg-orange-800 p-1 px-5 rounded-lg border border-orange-700 text-white">
								{ form.mods.length ? "Modded" : "Vanilla" }
							</div>
						</div>
					</div>

					<div className="p-3 flex flex-col gap-3">
						<SBSInput label="Blueprint Title" value={ form.name } onChange={ e => setKey( "name", e.target.value ) } />
						<div className="flex flex-col">
							<div className="bg-gray-600 pt-2 rounded-lg">
								<Label htmlFor={ id + "desc" } className="text-lg p-3 w-full">Blueprit Description (.md / Markdown)</Label>
								<Textarea id={ id + "desc" } className="mt-2" style={ { minHeight: 200, maxHeight: 200 } } value={ form.description } onChange={ e => setKey( "description", e.target.value ) } />
							</div>
						</div>
						<SBSSelect label="Tags">
							<Select options={ tagsSelectOptions } className="gray-select flex-1"
								value={ formTags }
								classNamePrefix="my-react-select" isMulti={ true } onChange={ e => {
									setTags( e );
									if( e ) {
										form.tags = e.map( e => e.value );
									}
								} } />
						</SBSSelect>
						<SBSSelect label="Designer Size">
							<Select options={ designerSizeOptions } className="gray-select flex-1"
								value={ DesignerSize }
								classNamePrefix="my-react-select" isMulti={ false } onChange={ e => {
									setDesignerSize( e );
									if( e ) {
										form.DesignerSize = e.value;
									}
								} } />
						</SBSSelect>

						<SBSInput name="sbp" accept=".sbp" required={ !isEditing } label="Blueprint (.sbp)" type="file" onChange={ handleFileSelect } />
						<SBSInput name="sbpcfg" accept=".sbpcfg" required={ !isEditing } label="Blueprint Config (.sbpcfg" type="file" onChange={ handleFileSelect } />
					 	{ checkList[ 2 ] && (
							<Button onClick={ exportDatas } fullSized>Export blueprint name and description from files</Button>
						) }
						<SBSInput name="img" accept=".gif,.jpg,.jpeg,.png" multiple max={ 5 } min={ 1 } required={ !isEditing } label="Images (Min 1, Max 5)" type="file" onChange={ handleFileSelect } />

						{ ( ( !isEditing && checkList[ 0 ] && checkList[ 1 ] && checkList[ 2 ] && checkList[ 3 ] ) || isEditing ) && (
							<LoadingButton isLoading={ isUploading } color="green" onClick={ uploadBlueprint } Icon={ BiSave } fullSized>Start Upload</LoadingButton>
						) }
					</div>
				</div>

				<div className="flex flex-col xl:col-span-2 w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
					<div className="flex-1 flex flex-col mb-auto">
						<div className="p-3 border-b bg-gray-900 border-gray-700 text-neutral-300 rounded-t-lg">
							<BiUser className="inline me-1 text-xl pb-1" /> <b>Creator:</b> <span className="text-neutral-100">{ user.Get.username }</span>
						</div>
						<div className="p-3 border-b bg-gray-900 border-gray-700 text-neutral-300">
							<MdOutlinePhotoSizeSelectSmall className="inline me-1 text-xl pb-1" /> <b>Designer Size:</b> <span className="text-neutral-100">{ form.DesignerSize }</span>
						</div>
						<div className="p-3 border-b bg-gray-900 border-gray-700 text-neutral-300">
							<BsHouseAdd className="inline me-1 text-xl pb-1" /> <b>Buildings:</b> <span className="text-neutral-100">{ buildingCount }</span>
						</div>
						<div className="p-3 border-b bg-gray-900 border-gray-700 text-neutral-300">
							<BsBox className="inline me-1 text-xl pb-1" /> <b>Object-Count:</b> <span className="text-neutral-100">{ blueprintParse?.objects.length || 0 }</span>
						</div>
						<div className="p-3 border-b bg-gray-900 border-gray-700 text-neutral-300">
							<BsBoxes className="inline me-1 text-xl pb-1" /> <b>Total Cost:</b> <span className="text-neutral-100">{ totalItemCost } items</span>
						</div>
						<div className="p-3 border-b bg-gray-900 border-gray-700 text-neutral-300">
							<BiTag className="inline me-1 text-xl pb-1" /> <b>Tags</b>
							{ !!Tags.length && <div className="flex flex-wrap p-2 text-neutral-200 text-xs gap-2">
								{ Tags.map( e => (
									<div key={ id + e._id } className="bg-gray-700 p-1 px-3 rounded-lg border border-gray-600 shadow">{ e.DisplayName }</div>
								) ) }
							</div> }
						</div>
						{ !!Mods.length && <div className="p-3 border-b bg-gray-900 border-gray-700 text-neutral-300">
							<BiWrench className="inline me-1 text-xl pb-1" /> <b>Used Mods:</b>
							{ Mods.map( e => (
								<Link to={ `https://ficsit.app/mod/${ e.id }` } target="_blank" key={ id + e.id } className="mt-2 flex hover:bg-gray-700 bg-gray-600 p-0 rounded-lg border border-gray-700 shadow">
									<img onError={ e => {
										e.currentTarget.src = "/images/default/unknown.png";
									} } src={ e.logo } alt={ e.name } className="h-8 w-8 rounded-l-lg" />
									<span className="px-2 py-1">{ e.name }</span>
								</Link>
							) ) }
						</div> }
					</div>

					<BlueprintEditorCheckList done={ checkList[ 0 ] } optional={ isEditing } label="Title" >
						Set a title
					</BlueprintEditorCheckList>

					<BlueprintEditorCheckList done={ checkList[ 1 ] } optional={ isEditing } label="Description" >
						Write a description
					</BlueprintEditorCheckList>

					<BlueprintEditorCheckList done={ checkList[ 2 ] } optional={ isEditing } label="Blueprint" >
						Select the .sbp and .sbpcfg files (note the names must be matched)
					</BlueprintEditorCheckList>

					<BlueprintEditorCheckList done={ checkList[ 3 ] } optional={ isEditing } label="Images" >
						Select some images (up to 5 but min 1)
					</BlueprintEditorCheckList>

					<BlueprintEditorCheckList done={ checkList[ 4 ] } optional={ true } label="Tags" >
						set some tags
					</BlueprintEditorCheckList>
				</div>
			</div>
			<div className="mt-3 flex flex-col w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
				<div className="relative p-3 border-b bg-gray-700 border-gray-700 rounded-t-lg text-neutral-200 truncate text-ellipsis overflow-hidden">
					<span className="text-2xl">
						Description Preview
					</span>
				</div>

				<div className="p-3 flex flex-col gap-3">
					<ReactMarkdown components={ mdxComponents } className="text-neutral-200 flex-1 p-3 border-t-1 border-gray-700">
						{ form.description }
					</ReactMarkdown>
				</div>
			</div>
		</>
	);
};

export default BlueprintEditor;
