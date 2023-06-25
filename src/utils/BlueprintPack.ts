import { prisma } from "@/server/db";
import { Blueprint } from "@/utils/Blueprint";
import { kbotApi } from "@/utils/KBotApi";
import type { BlueprintPacks, RatingType } from '@prisma/client';


export type NewBlueprintPackData = Pick<BlueprintPacks, 'userId' | 'blueprints' | 'name' | 'description'>;

export async function createNewBlueprintPack( data: NewBlueprintPackData ) {
	const newBpData = await prisma.blueprintPacks.create( {
		data: {
			...data,
			downloads: 0,
			downloadIps: [] as string[],
			createdAt: new Date(),
			updatedAt: new Date(),
			mods: [] as string[],
			rating: [] as RatingType[],
			totalVotes: 0,
			totalRating: 0
		}
	} );
	const bpPack = await BlueprintPack.create( newBpData );
	bpPack.updateMods();
	return bpPack;
}

export class BlueprintPack {
	private blueprintPackId: string;
	private data: BlueprintPacks | null = null;

	private constructor( id: string | BlueprintPacks ) {
		if( typeof id === 'object' ) {
			this.data = id;
			this.blueprintPackId = id.id;
			return;
		}
		this.blueprintPackId = id;
	}

	private async getData( forceReload?: boolean ) {
		if( !this.data || !!forceReload ) {
			this.data = await prisma.blueprintPacks.findUnique( { where: { id: this.blueprintPackId } } );
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
					where: { id: this.blueprintPackId },
					data: { downloads: downloadIps.length + 1, downloadIps }
				} );
			}
		}
	}

	public async updateRating() {
		await this.getData( true );
		if( this.data ) {
			const maxRating = this.data.rating.length * 5;
			const currentTotalRating = this.data.rating.reduce( ( total, { rating } ) => total + rating, 0 );
			const totalRating = Math.round( currentTotalRating / maxRating * 5 * 100 ) / 100;
			const totalVotes = this.data.rating.length;

			await prisma.blueprintPacks.update( {
				where: { id: this.blueprintPackId },
				data: { totalRating, totalVotes }
			} );
		}
	}

	public async updateTags() {
		await this.getData( true );
		const bps = await this.blueprints();
		const categories = new Set<string>();

		for( const bp of bps ) {
			for( const tag of bp.dbData.categories ) {
				categories.add( tag );
			}
		}

		await prisma.blueprintPacks.update( {
			where: { id: this.blueprintPackId },
			data: { categories: Array.from( categories ) }
		} );
	}

	public async updateMods() {
		await this.getData( true );
		const bps = await this.blueprints();
		const mods = new Set<string>();

		for( const bp of bps ) {
			for( const mod of bp.dbData.mods ) {
				mods.add( mod );
			}
		}

		await prisma.blueprintPacks.update( {
			where: { id: this.blueprintPackId },
			data: { mods: Array.from( mods ) }
		} );
	}

	public static async create( id: string | BlueprintPacks ): Promise<BlueprintPack> {
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
