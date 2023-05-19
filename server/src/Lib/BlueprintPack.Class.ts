import type { IfClass } from "@shared/Types/helper";
import type { BlueprintPackExtended } from "../MongoDB/MongoBlueprints";
import { MongoBlueprintPacks } from "../MongoDB/MongoBlueprints";


export class BlueprintPackClass<T extends boolean = false> {
	private id: string;
	private data: IfClass<T, BlueprintPackExtended> = null as IfClass<T, BlueprintPackExtended>;

	private constructor( blueprintPackId: string ) {
		this.id = blueprintPackId;
	}

	static async createClass( blueprintId: string ): Promise<BlueprintPackClass<true> | undefined> {
		const BP = new BlueprintPackClass( blueprintId );
		await BP.readData();
		if( BP.isValid() ) {
			return BP;
		}
		return undefined;
	}

	public async readData() {
		try {
			this.data = ( await MongoBlueprintPacks.findById( this.id ).populate( [ 'owner', 'blueprints', 'tags' ] ) ) as IfClass<T, BlueprintPackExtended>;
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( "blueprint", e.message );
			}
		}
	}

	public isValid(): this is BlueprintPackClass<true> {
		return !!this.data;
	}

	public get get() {
		return this.data;
	}

	public async getDocument() {
		return await MongoBlueprintPacks.findById( this.data?._id  ).populate( [ 'owner', 'blueprints', 'tags' ] ).catch( () => {} );
	}

	public async remove() {
		const docu = await this.getDocument();
		if( await docu?.deleteOne() ) {
			return true;
		}
		return false;
	}

	/*public async parseBlueprint(): Promise<Blueprint | undefined> {
		if( this instanceof BlueprintClass<true> ) {
			const doc = await this.getDocument();
			if( doc ) {
				const sbp = path.join( __BlueprintDir, doc._id.toString(), `${ doc._id.toString() }.sbp` );
				const sbpcfg = path.join( __BlueprintDir, doc._id.toString(), `${ doc._id.toString() }.sbpcfg` );
				try {
					const blueprint = new BlueprintParser( doc.originalName, fs.readFileSync( sbp ), fs.readFileSync( sbpcfg ) );
					if( blueprint.Success ) {
						return blueprint.Get;
					}
				} catch( e ) {
					if( e instanceof Error ) {
						SystemLib.LogError( "blueprint", e.message );
					}
				}
			}
		}
		return undefined;
	}

	public isOwner( userId: string ) {
		return _.isEqual( userId, this.data?.owner );
	}

	public async remove(): Promise<boolean> {
		const bpDocument = await this.getDocument();
		if( bpDocument ) {
			const id = bpDocument._id.toString();

			fs.existsSync( path.join( __BlueprintDir, id ) ) && fs.rmdirSync( path.join( __BlueprintDir, id ) );
			fs.existsSync( path.join( __MountDir, "Zips", id ) ) && fs.rmdirSync( path.join( __MountDir, "Zips", id ) );

			await MongoBlueprintPacks.updateMany( { blueprints: bpDocument._id }, { $pull: { blueprints: bpDocument._id } } );
			await bpDocument.deleteOne();
		}
		return false;
	}*/
}
