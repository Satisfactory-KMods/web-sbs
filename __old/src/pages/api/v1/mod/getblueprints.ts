import { prisma } from '@/server/db';
import type { NextPageRoute } from '@/types/Next';
import type { IconDataType } from '@prisma/client';
import NextCors from 'nextjs-cors';
import { z } from 'zod';

interface SortType {
	skip: number;
	where?: {
		[key: string]: any;
	};
	orderBy: {
		[key: string]: 'asc' | 'desc';
	};
}

export const filterSchema = z.object({
	name: z.string().optional(),
	sortBy: z
		.object({
			by: z.string(),
			up: z.boolean()
		})
		.optional(),
	tags: z.array(z.string()).optional(),
	mods: z.array(z.string()).optional(),
	onlyVanilla: z.boolean().optional()
});

export function buildFilterOptions(filter: z.infer<typeof filterSchema>, skip?: string | number): SortType {
	const result: SortType = {
		orderBy: {},
		skip: 0
	};

	if (filter) {
		result.where = {};
		if (filter.name) {
			result.where.name = { contains: filter.name };
		}
		if (filter.sortBy) {
			result.orderBy[filter.sortBy.by] = filter.sortBy.up ? 'desc' : 'asc';
		}
		if (filter.tags) {
			result.where.tags = { hasEvery: filter.tags };
		}
		if (filter.mods) {
			result.where.mods = { hasEvery: filter.mods };
		}
		if (filter.onlyVanilla !== undefined) {
			result.where.isModded = true;
		}
	} else {
		result.orderBy.createdAt = 'desc';
	}

	if (skip) {
		result.skip = parseInt(skip.toString());
	}

	return result;
}

interface BlueprintModData {
	_id: string;
	name: string;
	mods: string[];
	tags: {
		_id: string;
		DisplayName: string;
	}[];
	originalName: string;
	owner: string;
	downloads: number;
	DesignerSize: string;
	createdAt: Date | string;
	updatedAt: Date | string;
	totalRating: number;
	totalRatingCount: number;
	SCIM: number;
	images: string[];
	iconData: IconDataType;
}

type BodyType = {
	skip?: number | string;
	limit: number | string;
	filterOptions: z.infer<typeof filterSchema>;
};

const POST: NextPageRoute<any, BodyType> = async (req, res) => {
	const { skip, limit, filterOptions } = req.body;
	const take = parseInt(limit.toString());

	z.number().optional().parse(skip);
	z.number().parse(take);
	filterSchema.optional().parse(filterOptions);

	const totalBlueprints = await prisma.blueprints.count({});
	const bps = await prisma.blueprints.findMany({ take, ...buildFilterOptions(filterOptions, skip) });
	const blueprints = await Promise.all(
		bps.map<Promise<BlueprintModData>>(async (bp) => ({
			_id: bp.id,
			name: bp.name,
			mods: bp.mods,
			tags: (
				await prisma.categories.findMany({ where: { name: { in: bp.categories } } })
			).map((e) => ({
				_id: e.id,
				DisplayName: e.name
			})),
			originalName: bp.originalName,
			owner: bp.scimUser,
			downloads: bp.downloads,
			DesignerSize: bp.designerSize,
			createdAt: bp.createdAt,
			updatedAt: bp.updatedAt,
			totalRating: bp.totalRating,
			totalRatingCount: bp.totalVotes,
			SCIM: bp.SCIMId,
			images: bp.images,
			iconData: bp.iconData
		}))
	);

	res.status(200).json({ totalBlueprints, blueprints });
};

export const handler: NextPageRoute<any, BodyType> = async (req, res) => {
	await NextCors(req, res, {
		methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
		origin: '*',
		optionsSuccessStatus: 200
	});

	if (req.method === 'POST') {
		return await POST(req, res).catch((e: any) => {
			if (e instanceof Error) {
				console.error(e);
			}
			res.status(500).json({ error: 'unknown' });
		});
	}
	return res.status(405).send('Method Not Allowed');
};

export default handler;
