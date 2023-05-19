import { BlueprintClass } from "@/server/src/Lib/Blueprint.Class";
import { parseBlueprintById } from "@/server/src/Lib/BlueprintParser";
import type { Tag } from "@/server/src/MongoDB/MongoTags";
import { ZodTagSchema } from "@/server/src/MongoDB/MongoTags";
import type { UserAccount } from "@/server/src/MongoDB/MongoUserAccount";
import { ZodUserAccountSchema } from "@/server/src/MongoDB/MongoUserAccount";
import { findModsFromBlueprint } from "@/src/Shared/blueprintReadingHelper";
import type { BlueprintConfig } from "@etothepii/satisfactory-file-parser";
import type { MongoBase } from "@server/Types/mongo";
import { EDesignerSize } from "@shared/Enum/EDesignerSize";
import * as mongoose from "mongoose";
import { z } from "zod";


const ZodRating = z.object( {
	userid: z.string().or( ZodUserAccountSchema ),
	rating: z.number().min( 1 ).max( 5 )
} );

const ZodColorData = z.object( {
	r: z.number(),
	g: z.number(),
	b: z.number(),
	a: z.number()
} );

const ZodIconData = z.object( {
	color: ZodColorData,
	iconID: z.number()
} );

const ZodBlueprintBase = z.object( {
	downloads: z.number(),
	originalName: z.string(),
	iconData: ZodIconData.optional(),
	name: z.string(),
	description: z.string(),
	owner: z.string().or( ZodUserAccountSchema ),
	DesignerSize: z.nativeEnum( EDesignerSize ),
	mods: z.array( z.string() ),
	rating: z.array( ZodRating ),
	totalRating: z.number(),
	totalRatingCount: z.number(),
	tags: z.array( z.string() ).or( z.array( ZodTagSchema ) ),
	images: z.array( z.string() )
} );

const ZodBlueprintPackSchema = z.object( {
	name: z.string(),
	description: z.string(),
	owner: z.string().or( ZodUserAccountSchema ),
	tags: z.array( z.string() ).or( z.array( ZodTagSchema ) ),
	blueprints: z.array( z.string() ).or( z.array( ZodBlueprintBase ) ),
	mods: z.array( z.string() ),
	rating: z.array( ZodRating ),
	totalRating: z.number(),
	totalRatingCount: z.number(),
	images: z.array( z.string() )
} );

const ZodBlueprintSchema = ZodBlueprintBase.merge( z.object( {
	inPacks: z.array( ZodBlueprintPackSchema ).or( z.array( z.string() ) )
} ) );

interface BPInterface extends z.infer<typeof ZodBlueprintSchema> {
	DesignerSize: EDesignerSize,
	owner: string,
	tags: string[],
	inPacks: string[]
}

interface BlueprintPackExtendedInterface extends z.infer<typeof ZodBlueprintPackSchema> {
	owner: UserAccount,
	tags: Tag[],
	blueprints: ( BPInterface & MongoBase )[]
}

interface BlueprintPackInterface extends z.infer<typeof ZodBlueprintPackSchema> {
	owner: string,
	tags: string[],
	blueprints: string[]
}

interface BPExtendedInterface extends z.infer<typeof ZodBlueprintSchema> {
	DesignerSize: EDesignerSize,
	owner: UserAccount,
	tags: Tag[],
	inPacks: BlueprintPack[]
}

export type BlueprintPack = BlueprintPackInterface & MongoBase;
export type BlueprintPackExtended = BlueprintPackExtendedInterface & MongoBase;
export type BlueprintData = BPInterface & MongoBase;
export type BlueprintDataExtended = BPExtendedInterface & MongoBase;
export type BlueprintRating = z.infer<typeof ZodRating>;
export type IconData = z.infer<typeof ZodIconData>;

export interface BlueprintPackSchemaMethods {
	updateRating: () => Promise<boolean>,
	updateModRefs: ( save?: boolean ) => Promise<void>
}

export interface BlueprintSchemaMethods {
	updateRating: () => Promise<boolean>,
	updateModRefs: ( save?: boolean ) => Promise<void>,
	updateBlueprintData: ( save?: boolean ) => Promise<void>
}

const BlueprintSchema = new mongoose.Schema( {
	name: { type: String, required: true },
	description: { type: String, required: true },
	mods: { type: [ String ], required: true, default: [] },
	tags: { type: [ mongoose.Schema.Types.ObjectId ], ref: "SBS_Tags", required: true, default: [] },
	rating: { type: [ {
		userid: { type: mongoose.Schema.Types.ObjectId, ref: "SBS_UserAccount", required: true },
		rating: { type: Number, required: true }
	} ],
	required: true },
	totalRating: { type: Number, required: true },
	totalRatingCount: { type: Number, required: true },
	DesignerSize: { type: String, required: true },
	owner: { type: mongoose.Schema.Types.ObjectId, ref: "SBS_UserAccount", required: true },
	downloads: { type: Number, required: true, default: 0 },
	images: { type: [ String ], required: true },
	inPacks: { type: [ mongoose.Schema.Types.ObjectId ], ref: "SBS_BlueprintPacks", required: true },
	originalName: { type: String, required: true, unique: true },
	iconData: { type: {
		color: { type: {
			r: { type: Number, required: false },
			g: { type: Number, required: false },
			b: { type: Number, required: false },
			a: { type: Number, required: false }
		},
		required: false },
		iconID: { type: Number, required: false }
	},
	required: false }
}, { timestamps: true,
	methods: {
		updateRating: async function() {
			const findRating = () => {
				const totalRating = this.rating.length * 5;
				const currentTotalRating = this.rating.reduce( ( total, rating ) => total + rating.rating, 0 );
				const currRating = Math.round( currentTotalRating / totalRating * 5 * 100 ) / 100;
				return !isNaN( currRating ) ? currRating : 0;
			};
			this.totalRating = findRating();
			this.totalRatingCount = this.rating.length;
			try {
				this.markModified( "rating" );
				this.markModified( "totalRating" );
				this.markModified( "totalRatingCount" );
				await this.save();
				return true;
			} catch( e ) {
				if( e instanceof Error ) {
					SystemLib.LogError( "mongo", e.message );
				}
			}
			return false;
		},
		updateModRefs: async function( save = true ) {
			const parse = parseBlueprintById( this._id.toString(), this.name );
			if( parse ) {
				this.mods = findModsFromBlueprint( parse.objects );
				if( save ) {
					this.markModified( "mods" );
					this.save();
				}
			}
		},
		updateBlueprintData: async function( save = true ) {
			try {
				const bp = await BlueprintClass.createClass( this._id.toString() );
				if( bp ) {
					const blueprint = await bp.parseBlueprint();
					if( blueprint ) {
						const partic: Partial<BlueprintConfig> = blueprint.config;
						delete partic.description;
						this.iconData = partic as IconData;
						this.markModified( "iconData" );
						if( save ) {
							await this.save();
						}
					}
				}
			} catch( e ) {
				if( e instanceof Error ) {
					SystemLib.LogError( "mongo", e.message );
				}
			}
		}
	} } );

const MongoBlueprints = mongoose.model<BlueprintData, mongoose.Model<BlueprintData, unknown, BlueprintSchemaMethods>>( "SBS_Blueprints", BlueprintSchema );

const BlueprintPackSchema = new mongoose.Schema( {
	name: { type: String, required: true },
	description: { type: String, required: true },
	mods: { type: [ String ], required: false },
	rating: { type: [ {
		userid: { type: mongoose.Schema.Types.ObjectId, ref: "SBS_UserAccount", required: true },
		rating: { type: Number, required: true }
	} ],
	required: true },
	totalRating: { type: Number, required: true },
	totalRatingCount: { type: Number, required: true },
	tags: { type: [ mongoose.Schema.Types.ObjectId ], ref: "SBS_Tags", required: false },
	owner: { type: mongoose.Schema.Types.ObjectId, ref: "SBS_UserAccount", required: true },
	blueprints: { type: [ mongoose.Schema.Types.ObjectId ], ref: "SBS_Blueprints", required: true }
}, { timestamps: true,
	methods: {
		updateRating: async function() {
			const findRating = () => {
				const totalRating = this.rating.length * 5;
				const currentTotalRating = this.rating.reduce( ( total, rating ) => total + rating.rating, 0 );
				const currRating = Math.round( currentTotalRating / totalRating * 5 * 100 ) / 100;
				return !isNaN( currRating ) ? currRating : 0;
			};
			this.totalRating = findRating();
			this.totalRatingCount = this.rating.length;
			try {
				this.markModified( "rating" );
				this.markModified( "totalRating" );
				this.markModified( "totalRatingCount" );
				await this.save();
				return true;
			} catch( e ) {
				if( e instanceof Error ) {
					SystemLib.LogError( "mongo", e.message );
				}
			}
			return false;
		},
		updateModRefs: async function( save = true ) {
			try {
				const blueprintSet = new Set<string>();
				const tagsSet = new Set<mongoose.Types.ObjectId>();
				for await ( const bp of MongoBlueprints.find( { _id: this.blueprints } ) ) {
					for( const mod of bp.mods ) {
						blueprintSet.add( mod );
					}
					for( const tag of bp.tags ) {
						tagsSet.add( new mongoose.Types.ObjectId( tag ) );
					}
				}
				this.mods = Array.from( blueprintSet );
				this.markModified( "mods" );
				this.tags = Array.from( tagsSet );
				this.markModified( "tags" );
				if( save ) {
					await this.save();
				}
				await MongoBlueprints.updateMany( {}, { $pull: { inPacks: this._id } } );
				await MongoBlueprints.updateMany( { _id: this.blueprints }, { $push: { inPacks: this._id } } );
			} catch( e ) {
				if( e instanceof Error ) {
					SystemLib.LogError( "mongo", e.message );
				}
			}
		}
	} } );


export const Revalidate = async() => {
	for await ( const bpDoc of MongoBlueprints.find( { iconData: { $exists: false } } ) ) {
		await bpDoc.updateBlueprintData();
	}
};

const MongoBlueprintPacks = mongoose.model<BlueprintPack, mongoose.Model<BlueprintPack, unknown, BlueprintPackSchemaMethods>>( "SBS_BlueprintPacks", BlueprintPackSchema );

export default MongoBlueprints;
export { BlueprintPackSchema, BlueprintSchema, MongoBlueprintPacks, ZodBlueprintPackSchema, ZodBlueprintSchema, ZodIconData, ZodRating };

