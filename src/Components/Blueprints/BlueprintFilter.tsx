import { LoadingButton } from "@app/Components/elements/Buttons";
import { SBSInput, SBSSelect } from "@app/Components/elements/Inputs";
import type { SelectOptionStruct } from "@app/Shared/Types/SelectOptions";
import { useSelectOptions } from "@app/hooks/useSelectOptions";
import type { FilterSchema } from "@server/trpc/routings/public/blueprint";
import type { Dispatch, FunctionComponent, PropsWithChildren, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { HiSearch } from "react-icons/hi";
import type { MultiValue, SingleValue } from "react-select";
import Select from "react-select";


interface BlueprintFilterProps extends PropsWithChildren {
	isFetching: boolean,
	filterSchema: [FilterSchema, Dispatch<SetStateAction<FilterSchema>>],
	doFetch: () => Promise<void>,
	hideTags?: boolean
}

const BlueprintFilter: FunctionComponent<BlueprintFilterProps> = ( { isFetching, filterSchema, doFetch, children, hideTags } ) => {
	const { tagsSelectOptions, modSelectOptions, sortSelectOptions, vanillaSelectOptions } = useSelectOptions();
	const [ filter, setFilter ] = filterSchema;

	const [ BlueprintName, setBlueprintName ] = useState<string>( "" );
	const [ SelectSorting, setSelectSorting ] = useState<SingleValue<SelectOptionStruct<FilterSchema["sortBy"]>>>( null );
	const [ SelectVanilla, setSelectVanilla ] = useState<SingleValue<SelectOptionStruct<boolean>>>( null );
	const [ SelectMods, setSelectMods ] = useState<MultiValue<SelectOptionStruct>>( [] );
	const [ SelectTags, setSelectTags ] = useState<MultiValue<SelectOptionStruct>>( [] );

	const dirtyRef = useRef( false );

	const ResetSearch = async() => {
		setBlueprintName( "" );
		setSelectTags( [] );
		setSelectMods( [] );
		setSelectVanilla( null );
		setSelectSorting( null );
		dirtyRef.current = true;
		setFilter( {} );
	};

	const applyFilter = async() => {
		const filter: FilterSchema = {
			sortBy: SelectSorting?.value || undefined,
			name: BlueprintName !== "" ? BlueprintName : undefined,
			onlyVanilla: SelectVanilla?.value !== undefined ? SelectVanilla?.value : undefined,
			mods: SelectMods.length > 0 ? SelectMods.map( e => e.value ) : undefined,
			tags: SelectTags.length > 0 ? SelectTags.map( e => e.value ) : undefined
		};
		dirtyRef.current = true;
		setFilter( filter );
	};

	useEffect( () => {
		if( dirtyRef.current ) {
			dirtyRef.current = false;
			doFetch();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ filter ] );

	return (
		<div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
			<div className="bg-gray-700 p-3 text-2xl font-semibold rounded-t-lg text-neutral-300 border-b border-gray-600 flex">
				{ children }
			</div>
			<div className="p-5 grid grid-cols-1 text-neutral-200 md:grid-cols-2 lg:grid-cols-3 gap-2">
				<SBSInput label="Blueprint Name" value={ BlueprintName }
					onChange={ ( e: any ) => setBlueprintName( e.target.value ) }>
					<HiSearch />
				</SBSInput>
				<SBSSelect label="Sort By">
					<Select options={ sortSelectOptions } className="gray-select flex-1"
						        classNamePrefix="my-react-select" isMulti={ false } value={ SelectSorting }
						        onChange={ setSelectSorting } />
				</SBSSelect>

				<SBSSelect label="Filter Modded">
					<Select options={ vanillaSelectOptions }
						className="gray-select flex-1"
						value={ SelectVanilla } isClearable={ true }
						classNamePrefix="my-react-select" onChange={ setSelectVanilla } />
				</SBSSelect>

				{ SelectVanilla?.value !== true && <SBSSelect label="Mods">
					<Select options={ modSelectOptions } className="gray-select flex-1"
						value={ SelectMods } isDisabled={ !!SelectVanilla?.value }
						classNamePrefix="my-react-select" isMulti={ true } onChange={ setSelectMods } />
				</SBSSelect> }

				{ !hideTags && <SBSSelect label="Tags">
					<Select options={ tagsSelectOptions } className="gray-select flex-1"
						value={ SelectTags }
						classNamePrefix="my-react-select" isMulti={ true } onChange={ setSelectTags } />
				</SBSSelect> }

				<div className="mt-2 md:mt-0 flex gap-2">
					<LoadingButton isLoading={ isFetching } color="gray" className="flex-1"
						Icon={ HiSearch } onClick={ applyFilter }>
					Search
					</LoadingButton>
					<LoadingButton isLoading={ isFetching } color="red" className="flex-1" Icon={ BiTrash }
						onClick={ ResetSearch }>
							Clear
					</LoadingButton>
				</div>
			</div>
		</div>
	 );
};

export default BlueprintFilter;
