import BlueprintEditorCheckList from "@app/Components/Blueprints/BlueprintEditorCheckList";
import { SBSInput, SBSSelect } from "@app/Components/elements/Inputs";
import DataContext from "@app/Context/DataContext";
import { successSwal, tRPCAuth, tRPCHandleError, tRPCPublic } from "@app/Lib/tRPC";
import { mdxComponents } from "@app/Page/terms/private/Page";
import type { SelectOptionStruct } from "@app/Shared/Types/SelectOptions";
import { useAuth } from "@app/hooks/useAuth";
import { LoadingButton } from "@comp/elements/Buttons";
import type { BlueprintData, BlueprintPack, BlueprintPackExtended } from "@server/MongoDB/MongoBlueprints";
import type { BlueprintCreateInput } from "@server/trpc/routings/auth/blueprintsPacks";
import { Label, Textarea } from "flowbite-react";
import _ from "lodash";
import type { FunctionComponent } from "react";
import { useContext, useEffect, useId, useMemo, useState } from "react";
import { BiSave, BiTag, BiUser, BiWrench } from "react-icons/bi";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate } from "react-router-dom";
import type { MultiValue } from "react-select";
import AsyncSelect from 'react-select/async';


export type BlueprintPackEditorProps = {
	blueprintPack?: BlueprintPackExtended
};

const BlueprintPackEditor: FunctionComponent<BlueprintPackEditorProps> = ( { blueprintPack } ) => {
	const id = useId();
	const navigate = useNavigate();
	const { user } = useAuth();
	const { mods, tags } = useContext( DataContext );
	const [ form, setForm ] = useState<Omit<BlueprintPack, "__v" | "_id" | "createdAt" | "updatedAt">>( () => {
		// @ts-ignore
		const defaultCopy = _.cloneDeep<Partial<BlueprintPack> | undefined>( blueprintPack );
		if( defaultCopy && blueprintPack ) {
			delete defaultCopy.__v;
			delete defaultCopy._id;
			delete defaultCopy.createdAt;
			delete defaultCopy.updatedAt;
			delete defaultCopy.owner;

			defaultCopy.owner = blueprintPack.owner._id;
			defaultCopy.tags = blueprintPack.tags.map( e => e._id );
			defaultCopy.blueprints = blueprintPack.tags.map( e => e._id );
		}
		// todo: fells bad/wrong :/
		const defaultForm: Omit<BlueprintPack, "__v" | "_id" | "createdAt" | "updatedAt"> = {
			name: "",
			description: "",
			owner: "",
			tags: [],
			blueprints: [],
			mods: [],
			rating: [],
			totalRating: 0,
			totalRatingCount: 0,
			images: []
		};
		return defaultCopy as Omit<BlueprintPack, "__v" | "_id" | "createdAt" | "updatedAt"> || defaultForm;
	} );

	const [ isUploading, setIsUploading ] = useState<boolean>( false );
	const [ selectedBlueprints, setSelectedBlueprints ] = useState<MultiValue<SelectOptionStruct>>( () => blueprintPack?.blueprints.map( e => ( { value: e._id, label: e.name } ) ) || [] );
	const [ blueprints, setBlueprints ] = useState<BlueprintData[]>( () => blueprintPack?.blueprints || [] );
	const [ options, setOptions ] = useState<SelectOptionStruct[]>( [] );

	const isEditing = !!blueprintPack;

	// smallHelper function to set form values
	function setKey<K extends keyof BlueprintPack>( key: K, value: BlueprintPack[K] ) {
		setForm( curr => ( {
			...curr,
			[ key ]: value
		} ) );
	}

	// [ title, desc ]
	const checkList = useMemo( () => {
		const checklist: boolean[] = [
			form.name.length > 0,
			form.description.length > 0,
			!!selectedBlueprints.length ];
		return checklist;
	}, [ form.description.length, form.name.length, selectedBlueprints.length ] );

	const createPack = async() => {
		setIsUploading( true );
		const data: BlueprintCreateInput["data"] = {
			name: form.name,
			description: form.description,
			blueprints: selectedBlueprints.map( e => e.value )
		};
		if( isEditing ) {
			const result = await tRPCAuth.blueprintPacks.modify.mutate( { data, blueprintPackId: blueprintPack._id } ).catch( tRPCHandleError );
			if( result ) {
				await successSwal( result.message );
				navigate( `/blueprintpacks/show/${ result.id }` );
			}
		} else {
			const result = await tRPCAuth.blueprintPacks.add.mutate( { data } ).catch( tRPCHandleError );
			if( result ) {
				await successSwal( result.message );
				navigate( `/blueprintpacks/show/${ result.id }` );
			}
		}
		setIsUploading( false );
	};

	useEffect( () => {
		if( selectedBlueprints.length === 0 ) {
			setBlueprints( [] );
			return;
		}

		tRPCPublic.blueprintPacks.getForEditor.mutate( { blueprintIds: selectedBlueprints.map( e => e.value ) } ).then( setBlueprints ).catch( tRPCHandleError );
	}, [ selectedBlueprints ] );

	const Mods = useMemo( () => {
		const blueprintMods = blueprints.reduce<string[]>( ( mods, blueprint ) => mods.concat( blueprint.mods ), [] );
		return Array.from( new Set( blueprintMods ) ).map( e => mods.find( mod => mod.mod_reference === e ) ).filter( e => !!e );
	}, [ blueprints, mods ] );

	const Tags = useMemo( () => {
		const blueprintTags = blueprints.reduce<string[]>( ( tags, blueprint ) => tags.concat( blueprint.tags ), [] );
		return Array.from( new Set( blueprintTags ) ).map( e => tags.find( tag => tag._id === e ) ).filter( e => !!e );
	}, [ blueprints, tags ] );

	let cachedTimer: NodeJS.Timeout | undefined = undefined;

	useEffect( () => {
		tRPCPublic.blueprint.getBlueprints.query( { limit: 100 } ).then(
			result => {
				setOptions( result.blueprints.map( e => ( { label: e.name, value: e._id } ) ).filter( e => !blueprints.find( b => _.isEqual( e.value, b._id ) ) ) );
			}
		).catch( tRPCHandleError );
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [  ] );


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

						<SBSSelect label="Blueprints">
							<AsyncSelect className="gray-select" isMulti onChange={ setSelectedBlueprints } classNamePrefix="my-react-select" loadOptions={ ( name, callback ) => {
								clearTimeout( cachedTimer );
								cachedTimer = setTimeout( async() => {
									cachedTimer = undefined;
									const result = await tRPCPublic.blueprint.getBlueprints.query( { limit: 20, filterOptions: { name } } ).catch( tRPCHandleError );
									if( result ) {
										callback( result.blueprints.map( e => ( { label: e.name, value: e._id } ) ).filter( e => !blueprints.find( b => _.isEqual( e.value, b._id ) ) ) );
									}
									callback( [] );
								}, 500 );
							} } defaultOptions={ options } value={ selectedBlueprints } />
						</SBSSelect>

						{ ( ( !isEditing && checkList[ 0 ] && checkList[ 1 ] && checkList[ 2 ] ) || isEditing ) && (
							<LoadingButton isLoading={ isUploading } color="green" onClick={ createPack } Icon={ BiSave } fullSized>{ isEditing ? "Edit" : "Create" } Blueprint Pack</LoadingButton>
						) }
					</div>
				</div>

				<div className="flex flex-col xl:col-span-2 w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
					<div className="flex-1 flex flex-col mb-auto">
						<div className="p-3 border-b bg-gray-900 border-gray-700 text-neutral-300 rounded-t-lg">
							<BiUser className="inline me-1 text-xl pb-1" /> <b>Creator:</b> <span className="text-neutral-100">{ user.Get.username }</span>
						</div>
						<div className="p-3 border-b bg-gray-900 border-gray-700 text-neutral-300">
							<BiTag className="inline me-1 text-xl pb-1" /> <b>Tags</b>
							{ !!Tags.length && <div className="flex flex-wrap p-2 text-neutral-200 text-xs gap-2">
								{ Tags.map( e => (
									<div key={ id + e!._id } className="bg-gray-700 p-1 px-3 rounded-lg border border-gray-600 shadow">{ e!.DisplayName }</div>
								) ) }
							</div> }
						</div>
						{ !!Mods.length && <div className="p-3 border-b bg-gray-900 border-gray-700 text-neutral-300">
							<BiWrench className="inline me-1 text-xl pb-1" /> <b>Used Mods:</b>
							{ Mods.map( e => (
								<Link to={ `https://ficsit.app/mod/${ e!.id }` } target="_blank" key={ id + e!.id } className="mt-2 flex hover:bg-gray-700 bg-gray-600 p-0 rounded-lg border border-gray-700 shadow">
									<img onError={ e => {
										e.currentTarget.src = "/images/default/unknown.png";
									} } src={ e!.logo } alt={ e!.name } className="h-8 w-8 rounded-l-lg" />
									<span className="px-2 py-1">{ e!.name }</span>
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

					<BlueprintEditorCheckList done={ checkList[ 2 ] } optional={ isEditing } label="Blueprints" >
						Select min 1 blueprint
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

export default BlueprintPackEditor;
