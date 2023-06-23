import { prisma } from "@/server/db";
import { Blueprint } from "@/utils/Blueprint";
import { kbotApi } from "@/utils/KBotApi";
import type { BlueprintPacks } from '@prisma/client';


export class BlueprintPack {
	private blueprintPackId: string;
	private data: BlueprintPacks | null = null;

	private constructor( id: string ) {
		this.blueprintPackId = id;
	}

	private async getData() {
		if( !this.data ) {
			this.data = await prisma.blueprintPacks.findUnique( { where: { id: this.blueprintPackId } } );
		}
		return this.data;
	}

	public static async create( id: string ): Promise<BlueprintPack> {
		const blueprintPack = new BlueprintPack( id );
		await blueprintPack.getData();
		return blueprintPack;
	}

	public get dbData() {
		return this.data!;
	}

	public async getMods() {
		return await kbotApi.getMods( this.data?.mods ?? [] );
	}

	public async blueprints() {
		const bps: Blueprint[] = [];
		for( const bp of ( this.data?.blueprints ?? [] ) ) {
			bps.push( await Blueprint.create( bp ) );
		}
		return bps;
	}
}
