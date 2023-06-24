import { prisma } from "@/server/db";
import { BlueprintReader } from "@/utils/BlueprintReader";
import { kbotApi } from "@/utils/KBotApi";
import { mountHandler } from '@/utils/MoundHandler';
import type { BlueprintConfig } from '@etothepii/satisfactory-file-parser';
import type { Blueprints, RatingType } from '@prisma/client';
import { join } from "path";


export type NewBlueprintData = Pick<Blueprints, 'SCIMId' | 'userId' | 'name' | 'description' | 'designerSize' | 'images' | 'tagIds' | 'originalName'>;

export async function createNewBlueprint( { userId, ...data }: NewBlueprintData ) {
	const newBpData = await prisma.blueprints.create( {
		data: {
			...data,
			mods: [] as string[],
			createdAt: new Date(),
			updatedAt: new Date(),
			rating: [] as RatingType[],
			totalVotes: 0,
			totalRating: 0,
			downloads: 0,
			downloadIps: [] as string[],
			user: { connect: { id: userId } },
			iconData: {
				iconID: 0,
				color: {
					r: 0,
					g: 0,
					b: 0,
					a: 0
				}
			}
		}
	} );
	const bp = await Blueprint.create( newBpData );
	bp.updateMods();
	return bp;
}

export class Blueprint {
	private blueprintId: string;
	private data: Blueprints | null = null;

	private constructor( id: string | Blueprints ) {
		if( typeof id === 'object' ) {
			this.data = id;
			this.blueprintId = id.id;
			return;
		}
		this.blueprintId = id;
	}

	private async getData( forceReload?: boolean ) {
		if( !this.data || !!forceReload ) {
			this.data = await prisma.blueprints.findUnique( { where: { id: this.blueprintId } } );
		}
		return this.data;
	}

	public async updateDownloads( ip: string ) {
		await this.getData( true );
		if( this.data ) {
			const downloadIps = this.data.downloadIps;
			if( !downloadIps.includes( ip ) ) {
				downloadIps.push( ip );
				await prisma.blueprintPacks.update( {
					where: { id: this.blueprintId },
					data: { downloads: downloadIps.length + 1, downloadIps }
				} );
			}
		}
	}

	public async updateRating() {
		await this.getData( true );
		if( this.data ) {
			const maxRating = this.data.rating.length * 5;
			const currentTotalRating = this.data.rating.reduce( ( total, { scalars } ) => total + scalars.rating, 0 );
			const totalRating = Math.round( currentTotalRating / maxRating * 5 * 100 ) / 100;
			const totalVotes = this.data.rating.length;

			await prisma.blueprintPacks.update( {
				where: { id: this.blueprintId },
				data: { totalRating, totalVotes }
			} );
		}
	}

	public async updateBlueprint() {
		const blueprint = this.blueprint;
		const bpConfig: BlueprintConfig = blueprint.blueprintData.config;
		await prisma.blueprints.update( {
			where: { id: this.blueprintId },
			data: {
				iconData: { set: {
					iconID: bpConfig.iconID,
					color: bpConfig.color
				} }
			}
		} );
		await this.updateMods();
	}

	public async updateMods() {
		const bp = this.blueprint;
		const mods = bp.getMods();
		await prisma.blueprints.update( {
			where: { id: this.blueprintId },
			data: { mods }
		} );
	}

	public async delete() {
		const bp = this.blueprint;
		const packs = await prisma.blueprintPacks.findMany( { where: { blueprints: { has: this.blueprintId } } } );
		for( const { id, blueprints } of packs ) {
			await prisma.blueprintPacks.update( { where: { id }, data: { blueprints: blueprints.filter( e => e !== this.blueprintId ) } } );
		}
		await prisma.blueprints.delete( { where: { id: this.blueprintId } } );
	}

	public static async create( id: string | Blueprints ): Promise<Blueprint> {
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
		return new BlueprintReader( join( mountHandler.blueprintDir, this.blueprintId ), this.blueprintId, this.data?.originalName || this.blueprintId );
	}
}