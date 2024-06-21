import { readFile } from 'fs/promises';
import isEqual from 'lodash/isEqual';
import { join } from 'path';
import type { Blueprint as OBlueprint } from 'update7-bp';
import { Parser as OldParser } from 'update7-bp';
import type { Blueprint } from 'update8-bp';
import { Parser } from 'update8-bp';
import { log } from '~/utils/logger';

export type OldBlueprint = OBlueprint;

/**
 * @description returns a list for all mods that have a object reference in this blueprint
 */
export const findModsFromBlueprint = (blueprint: Blueprint | OldBlueprint | undefined) => {
	if (!blueprint) {
		return [];
	}

	const query = {
		mods: new Set<string>()
	};

	findModsRecursive(blueprint, query);

	return Array.from(query.mods).filter((e) => !isEqual('FactoryGame', e) && !isEqual('Game', e));
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
			if (v.split('/')[1]) {
				mods.add(v.split('/')[1]!);
			}
		} else {
			if (v.split('/')[2]?.split('.')[0]) {
				mods.add(v.split('/')[2]!.split('.')[0]!);
			}
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

export class BlueprintParser<TOldBlueprint extends boolean = true> {
	private folder: string;
	private fileName: string;
	private blueprintName: string;
	private data: TOldBlueprint extends true ? Blueprint : OldBlueprint;
	private mods: string[] | undefined;
	private old: boolean = false;

	constructor(folder: string, fileName: string) {
		this.folder = folder;
		this.fileName = fileName;
		this.blueprintName = this.fileName;
		this.data = null as any;
	}

	static async create(folder: string, fileName: string) {
		return new Promise<BlueprintParser>(async (resolve, reject) => {
			try {
				const reader = new BlueprintParser(folder, fileName);
				await reader.read();
				resolve(reader);
			} catch (e) {
				reject(e);
			}
		}).catch((e) => {
			log('error', 'Error parse blueprint', e.message, folder);
			return null;
		});
	}

	public isOldBlueprint(): this is BlueprintParser<true> {
		return this.old;
	}

	public get success(): boolean {
		return !!this.blueprintName;
	}

	public get blueprintData() {
		return this.data!;
	}

	public getMods<TAsSet extends boolean = false>(
		asSet?: TAsSet
	): TAsSet extends true ? Set<string> : string[] {
		if (this.mods === undefined) {
			this.mods = findModsFromBlueprint(this.data);
		}
		return (asSet ? new Set(this.mods) : this.mods) as any;
	}

	private async read(): Promise<Blueprint | OBlueprint> {
		const sbp = await readFile(join(this.folder, this.fileName + '.sbp'));
		const sbpcfg = await readFile(join(this.folder, this.fileName + '.sbpcfg'));
		try {
			const parsed = Parser.ParseBlueprintFiles(this.blueprintName, sbp, sbpcfg);
			this.old = false;
			this.data = parsed as any;
			return parsed;
		} catch (e) {
			try {
				const parsed = OldParser.ParseBlueprintFiles(this.blueprintName, sbp, sbpcfg);
				this.old = true;
				this.data = parsed as any;
				return parsed;
			} catch (e) {
				if (e instanceof Error) {
					log('error', e.message);
				}
			}
		}
		throw new Error('Failed to read blueprint');
	}
}
