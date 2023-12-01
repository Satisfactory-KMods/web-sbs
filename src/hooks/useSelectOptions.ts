import { EDesignerSize } from '@app/Shared/Enum/EDesignerSize';
import DataContext from '@context/DataContext';
import type { FilterSchema } from '@server/trpc/routings/public/blueprint';
import type { SelectOptionStruct } from '@shared/Types/SelectOptions';
import _ from 'lodash';
import { useCallback, useContext, useMemo } from 'react';
import type { MultiValue, SingleValue } from 'react-select';

export function useSelectOptions() {
	const { mods, tags } = useContext(DataContext);

	const vanillaSelectOptions: MultiValue<SelectOptionStruct<boolean>> = useMemo(
		() => [
			{ value: true, label: 'Vanilla' },
			{ value: false, label: 'Modded' }
		],
		[]
	);

	const sortSelectOptions: MultiValue<SelectOptionStruct<FilterSchema['sortBy']>> = useMemo(
		() => [
			{ value: { by: 'createdAt', up: true }, label: 'Newest first' },
			{ value: { by: 'createdAt', up: false }, label: 'Oldest first' },
			{ value: { by: 'downloads', up: true }, label: 'Most downloads' },
			{ value: { by: 'downloads', up: false }, label: 'Fewest downloads' },
			{ value: { by: 'likes', up: true }, label: 'Most likes' },
			{ value: { by: 'likes', up: false }, label: 'Fewest likes' }
		],
		[]
	);

	const designerSizeOptions: MultiValue<SelectOptionStruct<EDesignerSize>> = useMemo(
		() => [
			{ value: EDesignerSize.mk1, label: EDesignerSize.mk1 },
			{ value: EDesignerSize.mk2, label: EDesignerSize.mk2 },
			{ value: EDesignerSize.mk3, label: EDesignerSize.mk3 },
			{ value: EDesignerSize.mk4, label: EDesignerSize.mk4 },
			{ value: EDesignerSize.mk5, label: EDesignerSize.mk5 }
		],
		[]
	);

	const tagsSelectOptions: MultiValue<SelectOptionStruct<string>> = useMemo(
		() =>
			tags.map((R) => ({
				label: R.DisplayName,
				value: R._id
			})),
		[tags]
	);

	const modSelectOptions: MultiValue<SelectOptionStruct<string>> = useMemo(
		() =>
			mods.map((R) => ({
				label: R.name,
				value: R.mod_reference
			})),
		[mods]
	);

	const modSelectedMulti: (mods: string[]) => MultiValue<SelectOptionStruct<string>> = useCallback(
		(mods) => modSelectOptions.filter((m) => mods.includes(m.value)),
		[modSelectOptions]
	);

	const modSelectedSingle: (mod: string) => SingleValue<SelectOptionStruct<string>> = useCallback(
		(mod) => modSelectOptions.find((m) => _.isEqual(mod, m.value)) || null,
		[modSelectOptions]
	);

	const tagSelectedMulti: (tags: string[]) => MultiValue<SelectOptionStruct<string>> = useCallback(
		(tags) => tagsSelectOptions.filter((m) => tags.includes(m.value)),
		[tagsSelectOptions]
	);

	const tagSelectedSingle: (tag: string) => SingleValue<SelectOptionStruct<string>> = useCallback(
		(tag) => tagsSelectOptions.find((m) => _.isEqual(tag, m.value)) || null,
		[tagsSelectOptions]
	);

	const designerSizeSingle: (designerSize: EDesignerSize) => SingleValue<SelectOptionStruct<EDesignerSize>> = useCallback(
		(designerSize) => designerSizeOptions.find((m) => _.isEqual(designerSize, m.value)) || null,
		[designerSizeOptions]
	);

	return {
		modSelectedMulti,
		modSelectedSingle,
		tagSelectedMulti,
		tagSelectedSingle,
		designerSizeSingle,
		modSelectOptions,
		tagsSelectOptions,
		vanillaSelectOptions,
		sortSelectOptions,
		designerSizeOptions
	};
}
