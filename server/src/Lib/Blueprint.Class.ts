import { BlueprintParser } from '@/server/src/Lib/BlueprintParser';
import type { Blueprint } from '@etothepii/satisfactory-file-parser';
import type { IfClass } from '@shared/Types/helper';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import type { BlueprintData } from '../MongoDB/MongoBlueprints';
import MongoBlueprints, { MongoBlueprintPacks } from '../MongoDB/MongoBlueprints';

export class BlueprintClass<T extends boolean = false> {
	private id: string;
	private data: IfClass<T, BlueprintData> = null as IfClass<T, BlueprintData>;

	private constructor(blueprintId: string) {
		this.id = blueprintId;
	}

	static async createClass(blueprintId: string): Promise<BlueprintClass<true> | undefined> {
		const BP = new BlueprintClass(blueprintId);
		await BP.readData();
		if (BP.isValid()) {
			return BP;
		}
		return undefined;
	}

	public async readData() {
		try {
			this.data = (await MongoBlueprints.findById(this.id)) as IfClass<T, BlueprintData>;
		} catch (e) {
			if (e instanceof Error) {
				SystemLib.LogError('blueprint', e.message);
			}
		}
	}

	public async getDocument() {
		return await MongoBlueprints.findById(this.data?._id).catch(() => {});
	}

	public async parseBlueprint(): Promise<Blueprint | undefined> {
		const doc = await this.getDocument();
		if (doc) {
			const sbp = path.join(__BlueprintDir, doc._id.toString(), `${doc._id.toString()}.sbp`);
			const sbpcfg = path.join(__BlueprintDir, doc._id.toString(), `${doc._id.toString()}.sbpcfg`);
			try {
				const blueprint = new BlueprintParser(doc.originalName, fs.readFileSync(sbp), fs.readFileSync(sbpcfg));
				if (blueprint.Success) {
					return blueprint.Get;
				}
			} catch (e) {
				if (e instanceof Error) {
					SystemLib.LogError('blueprint', e.message);
				}
			}
		}
		return undefined;
	}

	public isValid(): this is BlueprintClass<true> {
		return !!this.data;
	}

	public get get() {
		return this.data;
	}

	public isOwner(userId: string) {
		return _.isEqual(userId, this.data?.owner.toString());
	}

	public async remove(): Promise<boolean> {
		const bpDocument = await this.getDocument();
		if (bpDocument) {
			const id = bpDocument._id.toString();

			fs.existsSync(path.join(__BlueprintDir, id)) && fs.rmdirSync(path.join(__BlueprintDir, id), { recursive: true });
			fs.existsSync(path.join(__MountDir, 'Zips', id)) && fs.rmdirSync(path.join(__MountDir, 'Zips', id), { recursive: true });

			SystemLib.LogWarning('blueprints', 'Remove data for blueprint (delete):', id);
			await MongoBlueprintPacks.updateMany({ blueprints: bpDocument._id }, { $pull: { blueprints: bpDocument._id } });

			// remove all empty blueprint packs
			await MongoBlueprintPacks.deleteMany({ 'blueprints.0': { $exists: false } });
			await bpDocument.deleteOne();
			return true;
		}
		return false;
	}
}
