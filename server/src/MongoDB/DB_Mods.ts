import * as mongoose from "mongoose";

const ModSchema = new mongoose.Schema( {
	versions: {
		type: [
			{
				created_at: { type: Date, required: false },
				updated_at: { type: Date, required: false },
				changelog: { type: String, required: false },
				hash: { type: String, required: false },
				version: { type: String, required: false },
				sml_version: { type: String, required: false },
				id: { type: String, required: false }
			}
		], required: false
	},
	id: { type: String, required: true, unique: true },
	mod_reference: { type: String, required: false },
	name: { type: String, required: false },
	logo: { type: String, required: false },
	short_description: { type: String, required: false },
	source_url: { type: String, required: false },
	creator_id: { type: String, required: false },
	views: { type: Number, required: false },
	downloads: { type: Number, required: false },
	updated_at: { type: Date, required: false },
	created_at: { type: Date, required: false },
	last_version_date: { type: Date, required: false },
	hidden: { type: Boolean, required: false },
	authors: {
		type: [
			{
				user_id: { type: String, required: false },
				mod_id: { type: String, required: false },
				role: { type: String, required: false },
				user: {
					type: {
						id: { type: String, required: false },
						username: { type: String, required: false }
					}, required: false
				}
			}
		], required: false
	},
	latestVersions: {
		type: {
			alpha: {
				type: {
					created_at: { type: Date, required: false },
					updated_at: { type: Date, required: false },
					changelog: { type: String, required: false },
					hash: { type: String, required: false },
					version: { type: String, required: false },
					sml_version: { type: String, required: false },
					id: { type: String, required: false }
				}, required: false
			},
			beta: {
				type: {
					created_at: { type: Date, required: false },
					updated_at: { type: Date, required: false },
					changelog: { type: String, required: false },
					hash: { type: String, required: false },
					version: { type: String, required: false },
					sml_version: { type: String, required: false },
					id: { type: String, required: false }
				}, required: false
			},
			release: {
				type: {
					created_at: { type: Date, required: false },
					updated_at: { type: Date, required: false },
					changelog: { type: String, required: false },
					hash: { type: String, required: false },
					version: { type: String, required: false },
					sml_version: { type: String, required: false },
					id: { type: String, required: false }
				}, required: false
			}
		}, required: false
	}
}, { timestamps: true, strict: false } );

export type Mod = mongoose.InferSchemaType<typeof ModSchema>;

const myDB = mongoose.connections[ 0 ].useDb( "ficsit_app" );
export default myDB.model<Mod>( "Mods", ModSchema );
export { ModSchema };