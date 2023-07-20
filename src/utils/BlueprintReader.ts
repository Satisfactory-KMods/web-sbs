import { readFileSync } from 'fs';
import { isEqual } from 'lodash';
import { join } from 'path';
import type { Blueprint as OBlueprint } from 'update7-bp';
import { Parser as OldParser } from 'update7-bp';
import type { Blueprint } from 'update8-bp';
import { Parser } from 'update8-bp';

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

export class BlueprintReader {
	private path: string;
	private fileName: string;
	private blueprintName: string;
	private data: Blueprint | OldBlueprint | undefined;
	private mods: string[] | undefined;

	constructor(path: string, fileName: string, blueprintName?: string) {
		this.path = path;
		this.fileName = fileName;
		this.blueprintName = blueprintName ?? this.fileName;
		this.data = this.read();
	}

	public get success(): boolean {
		return !!this.blueprintName;
	}

	public get blueprintData(): Blueprint | OldBlueprint {
		return this.data!;
	}

	public getMods(): string[] {
		if (this.mods === undefined) {
			this.mods = findModsFromBlueprint(this.data);
		}
		return this.mods;
	}

	private read(): Blueprint | OldBlueprint | undefined {
		try {
			const sbp = readFileSync(join(this.path, this.fileName + '.sbp'));
			const sbpcfg = readFileSync(join(this.path, this.fileName + '.sbpcfg'));
			try {
				return Parser.ParseBlueprintFiles(this.blueprintName, sbp, sbpcfg);
			} catch (e) {
				try {
					return OldParser.ParseBlueprintFiles(this.blueprintName, sbp, sbpcfg);
				} catch (e) {
					if (e instanceof Error) {
						console.error(e.message);
					}
				}
			}
		} catch (e) {
			if (e instanceof Error) {
				console.error(e.message);
			}
		}
		return undefined;
	}
}
