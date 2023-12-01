import type { Blueprint } from '@etothepii/satisfactory-file-parser';
import _ from 'lodash';

/**
 * @description returns a list for all mods that have a object reference in this blueprint
 */
export const findModsFromBlueprint = (blueprint: Blueprint | undefined) => {
	if (!blueprint) {
		return [];
	}

	const query = {
		mods: new Set<string>()
	};

	findModsRecursive(blueprint, query);

	return Array.from(query.mods).filter((e) => !_.isEqual('FactoryGame', e) && !_.isEqual('Game', e));
};

export const findModsRecursive = (
	v: any,
	{
		mods
	}: {
		mods: Set<string>;
	}
) => {
	if (typeof v === 'string' && v.startsWith('/')) {
		if (!v.startsWith('/Script/')) {
			mods.add(v.split('/')[1]);
		} else {
			mods.add(v.split('/')[2].split('.')[0]);
		}
		return;
	}

	if (typeof v === 'object' && !Array.isArray(v)) {
		for (const [, element] of Object.entries(v)) {
			findModsRecursive(element, { mods });
		}
		return;
	}

	if (Array.isArray(v)) {
		for (const element of v) {
			findModsRecursive(element, { mods });
		}
		return;
	}
};
