import type { SelectOptionStruct } from "@shared/Types/SelectOptions";
import {
	useCallback,
	useContext,
	useMemo
}                                  from "react";
import DataContext                 from "@context/DataContext";
import type { FilterSchema }       from "@server/trpc/routings/public/blueprint";
import type {
	MultiValue,
	SingleValue
}                                  from "react-select";
import _                           from "lodash";

export function useSelectOptions() {
	const { mods, tags } = useContext( DataContext );

	const vanillaSelectOptions : MultiValue<SelectOptionStruct<boolean>> = useMemo( () => [
		{ value: true, label: "Vanilla" },
		{ value: false, label: "Modded" }
	], [] );

	const sortSelectOptions : MultiValue<SelectOptionStruct<FilterSchema["sortBy"]>> = useMemo( () => [
		{ value: { by: "createdAt", up: true }, label: "Newest first" },
		{ value: { by: "createdAt", up: false }, label: "Oldest first" },
		{ value: { by: "downloads", up: true }, label: "Most downloads" },
		{ value: { by: "downloads", up: false }, label: "Fewest downloads" },
		{ value: { by: "likes", up: true }, label: "Most likes" },
		{ value: { by: "likes", up: false }, label: "Fewest likes" }
	], [] );

	const tagsSelectOptions : MultiValue<SelectOptionStruct<string>> = useMemo( () => tags.map( R => ( {
		label: R.DisplayName,
		value: R._id
	} ) ), [ tags ] );

	const modSelectOptions : MultiValue<SelectOptionStruct<string>> = useMemo( () => mods.map( R => ( {
		label: R.name,
		value: R.mod_reference
	} ) ), [ mods ] );

	const modSelected_Multi : ( mods : string[] ) => MultiValue<SelectOptionStruct<string>> = useCallback( ( mods ) => {
		return modSelectOptions.filter( m => mods.includes( m.value ) );
	}, [ modSelectOptions ] );

	const modSelected_Single : ( mod : string ) => SingleValue<SelectOptionStruct<string>> = useCallback( ( mod ) => {
		return modSelectOptions.find( m => _.isEqual( mod, m.value ) ) || null;
	}, [ modSelectOptions ] );

	const tagSelected_Multi : ( tags : string[] ) => MultiValue<SelectOptionStruct<string>> = useCallback( ( tags ) => {
		return tagsSelectOptions.filter( m => tags.includes( m.value ) );
	}, [ tagsSelectOptions ] );

	const tagSelected_Single : ( tag : string ) => SingleValue<SelectOptionStruct<string>> = useCallback( ( tag ) => {
		return tagsSelectOptions.find( m => _.isEqual( tag, m.value ) ) || null;
	}, [ tagsSelectOptions ] );

	return {
		modSelected_Multi,
		modSelected_Single,
		tagSelected_Multi,
		tagSelected_Single,
		modSelectOptions,
		tagsSelectOptions,
		vanillaSelectOptions,
		sortSelectOptions
	};
}