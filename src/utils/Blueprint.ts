import { prisma } from "@/server/db";
import { BlueprintReader } from "@/utils/BlueprintReader";
import { kbotApi } from "@/utils/KBotApi";
import { mountHandler } from '@/utils/MoundHandler';
import type { Blueprints } from '@prisma/client';


export class Blueprint {
	private blueprintId: string;
	private data: Blueprints | null = null;

	private constructor( id: string ) {
		this.blueprintId = id;
	}

	private async getData() {
		if( !this.data ) {
			this.data = await prisma.blueprints.findUnique( { where: { id: this.blueprintId } } );
		}
		return this.data;
	}

	public static async create( id: string ): Promise<Blueprint> {
		const blueprint = new Blueprint( id );
		await blueprint.getData();
		return blueprint;
	}

	public get dbData() {
		return this.data!;
	}

	public async getMods() {
		return await kbotApi.getMods( this.data?.mods ?? [] );
	}

	public get blueprint() {
		return new BlueprintReader( mountHandler.blueprintDir, this.blueprintId, this.data?.originalName || this.blueprintId );
	}
}
