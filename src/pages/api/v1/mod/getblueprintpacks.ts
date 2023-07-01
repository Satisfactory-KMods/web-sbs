import { buildFilterOptions, filterSchema } from '@/pages/api/v1/mod/getblueprints';
import { prisma } from '@/server/db';
import type { NextPageRoute } from '@/types/Next';
import type { IconDataType } from '@prisma/client';
import NextCors from 'nextjs-cors';
import { z } from 'zod';

interface BlueprintPackModData {
	_id: string;
	name: string;
	mods: string[];
	tags: {
		_id: string;
		DisplayName: string;
	}[];
	owner: string;
	image: string;
	createdAt: Date | string;
	updatedAt: Date | string;
	blueprints: {
		_id: string;
		originalName: string;
		name: string;
		iconData: IconDataType;
	}[];
	totalRating: number;
	totalRatingCount: number;
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
	const bps = await prisma.blueprintPacks.findMany({ take, ...buildFilterOptions(filterOptions, skip) });
	const blueprints = await Promise.all(
		bps.map<Promise<BlueprintPackModData>>(async (bp) => {
			const bps = await prisma.blueprints.findMany({ where: { id: { in: bp.blueprints } } });
			return {
				_id: bp.id,
				name: bp.name,
				mods: bp.mods,
				tags: (await prisma.categories.findMany({ where: { name: { in: bp.categories } } })).map((e) => ({
					_id: e.id,
					DisplayName: e.name
				})),
				owner: (await prisma.user.findUnique({ where: { id: bp.userId } }))?.name || '???',
				image: bps[0]?.images[0] || '',
				createdAt: bp.createdAt,
				updatedAt: bp.updatedAt,
				blueprints: bps.map((a) => ({
					_id: a.id,
					originalName: a.originalName,
					name: a.name,
					iconData: a.iconData
				})),
				totalRating: bp.totalRating,
				totalRatingCount: bp.totalVotes
			};
		})
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
