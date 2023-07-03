import { prisma } from '@/server/db';
import type { NextRoute } from '@/types/Next';
import { nextRouteError } from '@/utils/api/data';
import { getSearchParams } from '@/utils/api/params';
import { NextResponse } from 'next/server';

const GET: NextRoute = async (req) => {
	try {
		const { take, skip, search, order, orderBy, modded } = getSearchParams(req, {
			take: 10,
			skip: 0,
			search: '',
			order: [['asc', 'desc'], 'asc'],
			orderBy: [['totalVotes', 'totalRating', 'downloads', 'mods', 'createdAt', 'updatedAt'], 'createdAt'],
			modded: -1
		});

		const where: any = {};
		if (search.length > 0) {
			where.OR = [{ name: { contains: search } }, { description: { contains: search } }, { categories: { has: search } }, { mods: { has: search } }];
		}
		if (modded >= 0) {
			where.isModded = modded === 1;
		}

		const data = await prisma.blueprintPacks
			.findMany({
				where,
				take,
				skip,
				orderBy: {
					[orderBy as any]: order
				}
			})
			.catch(() => new Error('Invalid Search'));
		const max = await prisma.blueprintPacks.count().catch(() => 0);
		return NextResponse.json({ data, max });
	} catch (e) {
		if (e instanceof Error) {
			return nextRouteError(e.message, 400);
		}
	}
	return nextRouteError('Unknown Error', 500);
};

export { GET };
