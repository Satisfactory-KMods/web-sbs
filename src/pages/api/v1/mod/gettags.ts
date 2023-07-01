import { prisma } from '@/server/db';
import type { NextPageRoute } from '@/types/Next';
import NextCors from 'nextjs-cors';

const POST: NextPageRoute = async (req, res) =>
	res.status(200).json({
		tags: (await prisma.categories.findMany({})).map((e) => ({
			_id: e.id,
			DisplayName: e.name
		}))
	});

export const handler: NextPageRoute = async (req, res) => {
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
