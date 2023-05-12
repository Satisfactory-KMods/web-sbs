import type { IfClass } from "@shared/Types/helper";
import _ from "lodash";
import type { HydratedDocument } from "mongoose";
import type { BlueprintData, BlueprintSchemaMethods } from "../MongoDB/DB_Blueprints";
import DB_Blueprints from "../MongoDB/DB_Blueprints";

export class BlueprintClass<T extends boolean = false> {
	private id: string;
	private data: IfClass<T, BlueprintData> = null as IfClass<T, BlueprintData>;

	private constructor( blueprintId: string ) {
		this.id = blueprintId;
	}

	static async createClass( blueprintId: string ): Promise<BlueprintClass<true> | undefined> {
		const BP = new BlueprintClass( blueprintId );
		await BP.readData();
		if( BP.isValid() ) {
			return BP;
		}
		return undefined;
	}

	public async readData() {
		try {
			this.data =  await DB_Blueprints.findById( this.id ) as IfClass<T, BlueprintData> ;
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( e.message );
			}
		}
	}

	public async getDocument(): Promise<HydratedDocument<BlueprintData, BlueprintSchemaMethods>> {
		return DB_Blueprints.findById( this.data?._id );
	}

	public isValid(): this is BlueprintClass<true> {
		return !!this.data;
	}

	public get get() {
		return this.data;
	}

	public isOwner( userId: string ) {
		return _.isEqual( userId, this.data?.owner );
	}
}