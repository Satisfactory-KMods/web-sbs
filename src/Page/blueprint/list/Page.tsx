import BlueprintCard from "@app/Components/Blueprints/BlueprintCard";
import PageManager from "@app/Components/Main/PageManager";
import {
	tRPC_Public,
	tRPC_handleError
} from "@applib/tRPC";
import { LoadingButton } from "@comp/elements/Buttons";
import {
	SBSInput,
	SBSSelect
} from "@comp/elements/Inputs";
import { useRawPageHandler } from "@hooks/useRawPageHandler";
import { useSelectOptions } from "@hooks/useSelectOptions";
import { usePageTitle } from "@kyri123/k-reactutils";
import type { IndexLoaderData } from "@page/blueprint/list/Loader";
import type { BlueprintData } from "@server/MongoDB/DB_Blueprints";
import type { FilterSchema } from "@server/trpc/routings/public/blueprint";
import type { SelectOptionStruct } from "@shared/Types/SelectOptions";
import type { FunctionComponent } from "react";
import { useState } from "react";
import {
	BiTrash,
	HiSearch
} from "react-icons/all";
import { useLoaderData } from "react-router-dom";
import type {
	MultiValue,
	SingleValue
} from "react-select";
import Select from "react-select";

const Component: FunctionComponent = () => {
	const { blueprints, totalBlueprints } = useLoaderData() as IndexLoaderData;
	const { tagsSelectOptions, modSelectOptions, sortSelectOptions, vanillaSelectOptions } = useSelectOptions();

	const [ TotalBlueprints, setTotalBlueprints ] = useState<number>( () => totalBlueprints );
	const [ Blueprints, setBlueprints ] = useState<BlueprintData[]>( () => blueprints );
	const [ isFetching, setIsFetching ] = useState<boolean>( false );

	const [ filter, setFilter ] = useState<FilterSchema>( {} );

	async function onPageChange( options: { skip: number, limit: number }, newFiler?: FilterSchema ) {
		setIsFetching( true );
		const queryFilter = { filterOptions: { ...filter, ...newFiler }, ...options };
		const Blueprints = await tRPC_Public.blueprint.getBlueprints.query( queryFilter ).catch( tRPC_handleError );
		if( Blueprints ) {
			setBlueprints( Blueprints.blueprints );
			setTotalBlueprints( Blueprints.totalBlueprints );
		}
	    setIsFetching( false );
	}

	const { setPage, currentPage, maxPage, filterOption } = useRawPageHandler( TotalBlueprints, onPageChange, 12 );

	const [ BlueprintName, setBlueprintName ] = useState<string>( "" );
	const [ Select_Sorting, setSelect_Sorting ] = useState<SingleValue<SelectOptionStruct<FilterSchema["sortBy"]>>>( null );
	const [ Select_Vanilla, setSelect_Vanilla ] = useState<SingleValue<SelectOptionStruct<boolean>>>( null );
	const [ Select_Mods, setSelect_Mods ] = useState<MultiValue<SelectOptionStruct>>( [] );
	const [ Select_Tags, setSelect_Tags ] = useState<MultiValue<SelectOptionStruct>>( [] );

	usePageTitle( `SBS - Blueprints` );

	const DoFetch = async() => {
		const filter: FilterSchema = {
			sortBy: Select_Sorting?.value || undefined,
			name: BlueprintName !== "" ? BlueprintName : undefined,
			onlyVanilla: Select_Vanilla?.value || undefined,
			mods: Select_Mods.length > 0 ? Select_Mods.map( e => e.value ) : undefined,
			tags: Select_Tags.length > 0 ? Select_Tags.map( e => e.value ) : undefined
		};
		setFilter( filter );
		await onPageChange( filterOption, filter );
	};

	const ResetSearch = async() => {
		setBlueprintName( "" );
		setSelect_Tags( [] );
		setSelect_Mods( [] );
		setSelect_Vanilla( null );
		setSelect_Sorting( null );
		setFilter( {} );
		await onPageChange( filterOption, {
			sortBy: undefined,
			name: undefined,
			onlyVanilla: undefined,
			mods: undefined,
			tags: undefined
		} );
	};

	return (
		<>
			<div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
				<div className="bg-gray-700 p-3 text-2xl font-semibold text-neutral-300 border-b border-gray-600">
					Blueprint Filter
				</div>
				<div className="p-5 grid grid-cols-1 text-neutral-200 md:grid-cols-2 lg:grid-cols-3 gap-2">
					<SBSInput label="Blueprint Name" value={ BlueprintName }
						onChange={ ( e: any ) => setBlueprintName( e.target.value ) }>
						<HiSearch />
					</SBSInput>
					<SBSSelect label="Sort By">
						<Select options={ sortSelectOptions } className="gray-select flex-1"
						        classNamePrefix="my-react-select" isMulti={ false } value={ Select_Sorting }
						        onChange={ setSelect_Sorting } />
					</SBSSelect>

					<SBSSelect label="Filter Modded">
						<Select options={ vanillaSelectOptions }
							className="gray-select flex-1"
							value={ Select_Vanilla } isClearable={ true }
							classNamePrefix="my-react-select" onChange={ setSelect_Vanilla } />
					</SBSSelect>

					{ Select_Vanilla?.value !== true && <SBSSelect label="Mods">
						<Select options={ modSelectOptions } className="gray-select flex-1"
							value={ Select_Mods } isDisabled={ !!Select_Vanilla?.value }
							classNamePrefix="my-react-select" isMulti={ true } onChange={ setSelect_Mods } />
					</SBSSelect> }

					<SBSSelect label="Tags">
						<Select options={ tagsSelectOptions } className="gray-select flex-1"
							value={ Select_Tags }
							classNamePrefix="my-react-select" isMulti={ true } onChange={ setSelect_Tags } />
					</SBSSelect>

					<div className="mt-2 md:mt-0 flex gap-2">
						<LoadingButton isLoading={ isFetching } color="gray" className="flex-1"
							Icon={ HiSearch } onClick={ DoFetch }>
					Search
						</LoadingButton>
						<LoadingButton isLoading={ isFetching } color="red" className="flex-1" Icon={ BiTrash }
							onClick={ ResetSearch }>
							Clear Searching
						</LoadingButton>
					</div>
				</div>
			</div>

			<PageManager MaxPage={ maxPage } Page={ currentPage } OnPageChange={ setPage } />

			<div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
				{ Blueprints.map( BP => <BlueprintCard key={ BP._id } Data={ BP } onToggled={ DoFetch } /> ) }
			</div>

			<PageManager Hide={ maxPage === currentPage } MaxPage={ maxPage } Page={ currentPage } OnPageChange={ setPage } />
		</>
	);
};

export { Component };

