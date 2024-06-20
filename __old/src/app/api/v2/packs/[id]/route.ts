import { prisma } from '@/server/db';
import type { NextRoute } from '@/types/Next';
import { nextRouteError } from '@/utils/api/data';
import { NextResponse } from 'next/server';

const GET: NextRoute<{ id: string }> = async (_, context) => {
	const data = await prisma.blueprintPacks.findUnique({ where: { id: context.params.id } }).catch(() => null);
	if (!data) {
		return nextRouteError('Blueprint Pack not found!', 400);
	}
	return NextResponse.json(data);
};

export { GET };
