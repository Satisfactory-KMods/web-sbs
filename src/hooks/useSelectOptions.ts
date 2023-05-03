import type { SelectOptionStruct } from "@shared/Types/SelectOptions";
import { useLang }                 from "@hooks/useLang";
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
	const { Lang } = useLang();

	const vanillaSelectOptions : MultiValue<SelectOptionStruct<boolean>> = useMemo( () => [
		{ value: true, label: Lang.General.IsVanilla },
		{ value: false, label: Lang.General.IsModded }
	], [ Lang ] );

	const sortSelectOptions : MultiValue<SelectOptionStruct<FilterSchema["sortBy"]>> = useMemo( () => [
		{ value: { by: "createdAt", up: true }, label: Lang.Sorting.CreatedAt },
		{ value: { by: "createdAt", up: false }, label: Lang.Sorting.CreatedAtRev },
		{ value: { by: "downloads", up: true }, label: Lang.Sorting.Downloads },
		{ value: { by: "downloads", up: false }, label: Lang.Sorting.DownloadsRev },
		{ value: { by: "likes", up: true }, label: Lang.Sorting.Likes },
		{ value: { by: "likes", up: false }, label: Lang.Sorting.LikesRev },
		{ value: { by: "mods", up: true }, label: Lang.Sorting.Mods },
		{ value: { by: "mods", up: false }, label: Lang.Sorting.ModsRev },
		{ value: { by: "tags", up: true }, label: Lang.Sorting.Tags },
		{ value: { by: "tags", up: false }, label: Lang.Sorting.TagsRev }
	], [ Lang ] );

	const tagsSelectOptions : MultiValue<SelectOptionStruct<string>> = useMemo( () => tags.map( R => ( {
		label: R.DisplayName,
		value: R._id
	} ) ), [ tags ] );

	const modSelectOptions : MultiValue<SelectOptionStruct<string>> = useMemo( () => mods.map( R => ( {
		label: R.name,
		value: R._id
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