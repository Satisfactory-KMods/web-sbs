import type { Mod } from '@kyri123/lib';
import * as mongoose from 'mongoose';

const ModSchema = new mongoose.Schema<Mod>(
	{
		versions: {
			type: [
				{
					created_at: { type: Date, required: true },
					updated_at: { type: Date, required: true },
					changelog: { type: String, required: true },
					hash: { type: String, required: true },
					version: { type: String, required: true },
					sml_version: { type: String, required: true },
					id: { type: String, required: true }
				}
			],
			required: true
		},
		id: { type: String, required: true, unique: true },
		mod_reference: { type: String, required: true },
		name: { type: String, required: true },
		logo: { type: String, required: true },
		short_description: { type: String, required: true },
		source_url: { type: String, required: true },
		creator_id: { type: String, required: true },
		views: { type: Number, required: true },
		downloads: { type: Number, required: true },
		updated_at: { type: Date, required: true },
		created_at: { type: Date, required: true },
		last_version_date: { type: Date, required: true },
		hidden: { type: Boolean, required: true },
		authors: {
			type: [
				{
					user_id: { type: String, required: true },
					mod_id: { type: String, required: true },
					role: { type: String, required: true },
					user: {
						type: {
							id: { type: String, required: true },
							username: { type: String, required: true }
						},
						required: true
					}
				}
			],
			required: true
		},
		latestVersions: {
			type: {
				alpha: {
					type: {
						created_at: { type: Date, required: true },
						updated_at: { type: Date, required: true },
						changelog: { type: String, required: true },
						hash: { type: String, required: true },
						version: { type: String, required: true },
						sml_version: { type: String, required: true },
						id: { type: String, required: true }
					},
					required: true
				},
				beta: {
					type: {
						created_at: { type: Date, required: true },
						updated_at: { type: Date, required: true },
						changelog: { type: String, required: true },
						hash: { type: String, required: true },
						version: { type: String, required: true },
						sml_version: { type: String, required: true },
						id: { type: String, required: true }
					},
					required: true
				},
				release: {
					type: {
						created_at: { type: Date, required: true },
						updated_at: { type: Date, required: true },
						changelog: { type: String, required: true },
						hash: { type: String, required: true },
						version: { type: String, required: true },
						sml_version: { type: String, required: true },
						id: { type: String, required: true }
					},
					required: true
				}
			},
			required: true
		}
	},
	{ timestamps: true, strict: false }
);

export { Mod };

const myDB = mongoose.connections[0].useDb('ficsit_app');
export default myDB.model<Mod>('Mods', ModSchema);
export { ModSchema };
